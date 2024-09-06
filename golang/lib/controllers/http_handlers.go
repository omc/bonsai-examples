package controllers

import(
	"../elasticsearch"
	"../views"
	"../errors"
	"gopkg.in/olivere/elastic.v2"
	"net/http"
	"sort"
)

func IndexBuilder(w http.ResponseWriter, r *http.Request) {
	es,index := elasticsearch.ConfirmIndex(w, r)
	if index != "" {

		// Get a list of sorted index names
		indices, _ := es.IndexNames()
		sort.Strings(indices)

		// Query for some docs
		// Use default settings for FROM and SIZE
		query := elastic.NewQueryStringQuery("*")
		docs,_ := es.Search().From(0).Size(10).Index(index).Query(query).Pretty(true).Do()

		// Get a mapping for the index
		mappings := elasticsearch.GetIndexMappings(es, index)
		var mappingTypes []string
		typeCounts := make(map[string]int64)
		if docs.TotalHits() > 0 {
			// No docs? Then there ain't no mappin' to get
			types := mappings[index].(map[string]interface{})["mappings"].(map[string]interface{})
			mappingTypes = elasticsearch.GetTypesFromMapping(types)
			sort.Strings(mappingTypes)

			for _,i:=range mappingTypes {
				typeDocs,_ := es.Search().From(0).Size(10).Index(index).Type(i).Query(query).Pretty(true).Do()
				typeCounts[i] = typeDocs.TotalHits()
			}
		}

		//Create a view with the data and render it for the user
		p := &views.View{
			Title:        "Overview of " + index,
			Hits:         docs.TotalHits(),
			Docs:         docs.Hits.Hits,
			Name:         index,
			IndexCount:   len(indices),
			Indices:      indices,
			Mappings:     mappings,
			MappingTypes: mappingTypes,
			TypeCounts:   typeCounts}
		views.Render(p, w, r, "index")
	}
}

func RootBuilder(w http.ResponseWriter, r *http.Request) {
	es := elasticsearch.GetClient()
	indices,err := es.IndexNames()

	if err != nil {
		errors.ExitOnError(err, errors.INDEX_NAME_ERROR)
	}
	sort.Strings(indices)
	health := elasticsearch.GetClusterHealth(es)
	stats  := elasticsearch.GetClusterStats(es)
	p := &views.View{
		Title:      "Cluster Overview",
		Health:      health,
		Stats:       stats,
		IndexCount:  len(indices),
		Indices:     indices}
	views.Render(p, w, r, "root")
}
