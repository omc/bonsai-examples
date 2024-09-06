package views

import(
	"fmt"
	"html/template"
	"net/http"
	"../errors"
	"gopkg.in/olivere/elastic.v2"
	"os"
	"path/filepath"
	"sort"
"strings"
)

// Define a struct for views
type View struct {

	/* Page attributes */
	Title          string

	/* Flash messages */
	SuccessMessage string
	InfoWarning    string
	WarningMessage string
	ErrorMessage   string

	/* Data */
	Hits           int64
	IndexCount     int
	Indices        []string
	Name           string
	Health         *elastic.ClusterHealthResponse
	Stats          *elastic.IndicesStatsResponse
	Docs           []*elastic.SearchHit
	Mappings       map[string]interface {}
	MappingTypes   []string
	TypeCounts     map[string]int64
}

// Render the view:
func Render(p *View, w http.ResponseWriter, r *http.Request, name string) {

	funcMap := template.FuncMap {
		"jsonDecode":    jsonDecode,
		"mappingFields": mappingFields,
		"d3data": d3data,
	}

	cwd, _ := os.Getwd()
	templatePath := filepath.Join( cwd, "./lib/views/templates/")
	fmt.Printf("Rendering view '%s' for %s. Using template %s\n", name , r.URL.Path, templatePath+"/" + name + ".tmpl")
	t, err := template.New("main").Funcs(funcMap).ParseFiles(
		templatePath + "/header.tmpl",
		templatePath + "/nav.tmpl",
		templatePath + "/container.tmpl",
		templatePath + "/sidebar.tmpl",
		templatePath + "/" + name + ".tmpl",
		templatePath + "/footer.tmpl",
		templatePath + "/view.tmpl")
	if err != nil {
		errors.ExitOnError(err, errors.TEMPLATE_PARSE_FAILURE)
	}
	err = t.ExecuteTemplate(w, "view", p)
	if err != nil {
		errors.ExitOnError(err, errors.TEMPLATE_EXECUTE_FAILURE)
	}

}

func jsonDecode(hit elastic.SearchHit) string {
	/*
	Go uses these six types for all values parsed into interfaces:

	bool, for JSON booleans
	float64, for JSON numbers
	string, for JSON strings
	[]interface{}, for JSON arrays
	map[string]interface{}, for JSON objects
	nil for JSON null
	*/

	return string(*hit.Source)
}

func mappingFields(mapping map[string]interface{}, index string, indexType string) []string {
	var fields []string
	m := mapping[index].
	     (map[string]interface{})["mappings"].
	     (map[string]interface{})[indexType].
	     (map[string]interface{})["properties"].
	     (map[string]interface{})
	for v,q := range m {
		fields = append(fields, formatField(v, formatFieldType(q.(map[string]interface{}))))
	}
	sort.Strings(fields)
	return fields
}

func d3data(typeCounts map[string]int64) template.JS {
	d3data := "{"
	for i,v := range typeCounts {
		d3data = d3data + fmt.Sprintf("'%s': %d,", i, v)
	}
	d3data = d3data + "}"
	d3data = strings.Replace(d3data, ",}", "}", -1)
	return template.JS(d3data)
}

func formatFieldType(fieldType map[string]interface{}) string {
	dataType := fmt.Sprintf("%v",fieldType["type"])
	if dataType == "<nil>" {
		return "json"
	}
	return dataType
}

func formatField(name string, fieldType string) string {
	return name + ": " + fieldType
}