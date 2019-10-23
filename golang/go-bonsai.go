package main

import(
	"./lib/controllers"
	"net/http"
)

func main() {
	http.HandleFunc("/", rootHandler)
	http.HandleFunc("/index/", indexHandler)
	http.ListenAndServe(":8080", nil)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	controllers.IndexBuilder(w, r)
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	controllers.RootBuilder(w, r)
}
