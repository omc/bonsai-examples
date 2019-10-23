package elasticsearch

import(
	"gopkg.in/olivere/elastic.v2"
	"os"
	"regexp"
	"strings"
	"net/http"
	"fmt"
	"../errors"
	"../views"
)

// Instantiate an Elasticsearch client
func GetClient() *elastic.Client {
	user,pass,host := parseBonsaiURL()
	client, err := elastic.NewSimpleClient(
		elastic.SetURL(host),
		elastic.SetMaxRetries(10),
		elastic.SetBasicAuth(user,pass),
		elastic.SetSniff(false))
	if err != nil {
		errors.ExitOnError(err, errors.CLIENT_FAILURE)
	}
	return client
}

//
func GetClusterHealth(es *elastic.Client) *elastic.ClusterHealthResponse {
	health,_ := 	es.ClusterHealth().
			Do()
	return health
}

//
func GetClusterStats(es *elastic.Client) *elastic.IndicesStatsResponse {
	stats,_ := 	es.IndexStats().
			   Index("_all").
			   Human(true).
			   Pretty(true).
			   Do()
	return stats
}

func SearchDocuments(es *elastic.Client, index string) *elastic.SearchResult {
	docs,_ :=    es.Search().
			Index(index).
			Do()
	return docs
}

func GetIndexMappings(es *elastic.Client, index string) map[string]interface{} {
	mappings,err := es.GetMapping().Index(index).Do()
	if err != nil {
		errors.ExitOnError(err, errors.INDEX_MAPPING_ERROR)
	}
	return mappings
}

// Make sure that an index exists before we do anything with it.
// If it exists, return the client for reuse
func ConfirmIndex(w http.ResponseWriter, r *http.Request) (*elastic.Client, string) {
	rex, err := regexp.Compile("/index/(.*?)")
	index := rex.ReplaceAllString(r.URL.Path, "$1")
	if err != nil {
		errors.ExitOnError(err, errors.REGEX_COMPILE)
	}
	es := GetClient()
	indexCheck, err := es.IndexExists(index).Do()
	if indexCheck == false {
		indices,_ := es.IndexNames()
		fmt.Printf("Aw, brah, I couldn't find an index called '%s'!\n", index)
		p := &views.View{IndexCount: len(indices), Indices: indices, ErrorMessage: "That index doesn't exist!"}
		views.Render(p, w, r, "root")
		return es,""
	} else if err != nil {
		errors.ExitOnError(err, errors.INDEX_EXISTS_ERROR)
	}
	return es, index
}

func parseBonsaiURL() (string, string, string){
	url := os.Getenv("BONSAI_URL")
	rex, _ := regexp.Compile(".*?://([a-z0-9]{1,}):([a-z0-9]{1,})@.*$")
	user := rex.ReplaceAllString(url, "$1")
	pass := rex.ReplaceAllString(url, "$2")
	host := strings.Replace(url, user+":"+pass+"@", "", -1)
	return user,pass,host
}

func GetTypesFromMapping(m map[string]interface{}) (types []string) {
	for k := range m {
		types = append(types, k)
	}
	return types
}

