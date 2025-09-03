# Example API server

An example API server that connects to an Elasticsearch (v7.10.2) cluster, creates an index with sample data
(if not exist), and then listens on port `3000` for requests to `/api/books`. Requests to `/api/books` serve up
JSON data after querying the Elasticsearch cluster!

## Usage

### Fly.io

Note: launching resources on fly.io may cost money. Running the commands below may
incur billing charges on fly.io.

1. Login to Fly.io

   If you haven't already, install `flyctl` and log in:

    ```shell
    # Install the flyctl command-line tool, if you haven't already
    # ref: https://fly.io/docs/flyctl/install/
    curl -L https://fly.io/install.sh | sh
    fly auth login
    ```

2. Launch the app on Fly.io.

   ```shell
   fly launch --no-deploy
   ```

3. **Set the environment variables**

   ```shell
   # Based on which proxy you're connecting to, select the desired app name:
   fly apps list
   # Example results:
   # NAME                            OWNER           STATUS          LATEST DEPLOY 
   # nginx-proxy-polished-dawn-4849  personal        deployed        2m2s ago
   fly secrets set ELASTICSEARCH_NODE="http://nginx-proxy-polished-dawn-4849.flycast:9200"
   ```
   
4. **Deploy**

   ```shell
   fly deploy
   ```

   Once deployed, the server will be publicly available at <your-app-name>.fly.dev:3000.

### Local

1. **Create the Docker network**

   ```shell
   docker network create bonsai-blog-post
   ```

2. **Build the Docker image**

   ```shell
   docker build -t bonsai-book-server .
   ```

3. **Set environment variables**

   ```shell
   # To use the nginx proxy from this blog post:
   # export ELASTICSEARCH_NODE="http://nginx-proxy:9200"

   # To use the node.js proxy from this blog post:
   # export ELASTICSEARCH_NODE="http://node-proxy:9200"
   ```

4. **Run the container**

   This command runs the web server in a container, mapping port `3000` on your local machine to the proxy server (also
   on `3000`).

   ```shell
   docker run \
       --network bonsai-blog-post  \
       --name book-server \
       -p 3000:3000 \
       -e ELASTICSEARCH_NODE="$ELASTICSEARCH_NODE" \
       bonsai-book-server
   ```
   
   The web server books endpoint is now running and accessible at **`http://localhost:3000/api/books`**.
