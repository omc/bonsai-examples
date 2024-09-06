## Go Bonsai! A lightweight Elasticsearch cluster exploration tool written in golang.

To get started, clone the repo:

```
git clone git@github.com:omc/dogfood-go.git
```

Make sure to export your Bonsai cluster URL to the dev environment:

```
export BONSAI_URL="https://user:pass@some-cool-cluster-12345678.us-east-1.bonsai.io"
```

Build the tool:

```
go build bonsai-example-go.go
```

Run it:

```
$ chmod +x go-bonsai
$ ./go-bonsai
```

Check it out by opening up a browser and navigating to http://localhost:8080
