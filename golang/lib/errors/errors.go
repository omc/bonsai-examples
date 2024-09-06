package errors

import (
	"fmt"
	"os"
)

const (
	CLIENT_FAILURE     = "Could not instantiate a client to the Elasticsearch cluster"
	JSON_DECODE_FAILURE = "Could not decode JSON"
	INDEX_EXISTS_ERROR = "The Elasticsearch client failed to determine whether the index exists"
	INDEX_NAME_ERROR   = "An error occurred while retrieving the cluster's index names"
	REGEX_COMPILE      = "Could not compile the regular expression"
	TEMPLATE_PARSE_FAILURE   = "The template engine failed to parse the requested view"
	TEMPLATE_EXECUTE_FAILURE = "The template engine failed to execute the requested view"
	INDEX_MAPPING_ERROR = "The requested index mapping could not be found"
)

// Quit the program if there is an error
func ExitOnError(err error, errMsg string) {
	fmt.Printf("The program exited with error category '%s'. Specific failure: %s\n", errMsg, err)
	os.Exit(1)
}