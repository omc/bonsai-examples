# Example Bonsai Elasticsearch Interleaving Proxy (Node.js)

An example proxy server built with Node.js and `http-proxy` that connects to a Bonsai Elasticsearch (7.10.2) cluster and
securely forwards all requests.

-----

## Usage

### Fly.io

1. **Login to Fly.io**

   If you haven't already, install `flyctl` and log in:

   ```shell
   # Install the flyctl command-line tool, if you haven't already
   # ref: https://fly.io/docs/flyctl/install/
   curl -L https://fly.io/install.sh | sh
   fly auth login
   ```
   
2. **Configure the fly app**

   ```shell
   fly launch --no-deploy --flycast
   ```

3. **Set Secrets**

   Go to your Bonsai cluster's credentials page to get your full database URL. Set it as a secret in Fly.io using the
   `ELASTICSEARCH_NODE` key.

   ```shell
   fly secrets set \
     ELASTICSEARCH_NODE="https://<user>:<password>@<your-cluster-name>.bonsaisearch.net"
   ```

4. **Deploy**

   ```shell
   fly deploy --flycast
   ```

   Once deployed, the Node.js proxy will be deployed into your Fly organization's internal network, available via the
   [Flycast](https://fly.io/docs/networking/flycast/) proxy at <your-app-name>.flycast:9200.

-----

### Local (with Docker)

1. **Create the Docker network**

   ```shell
   docker network create bonsai-blog-post
   ```

2. **Build the Docker image**

   ```shell
   docker build -t bonsai-node-proxy .
   ```
   
3. **Set environment variables**

    ```shell
    # Visit the credentials page on your Bonsai.io cluster overview to fetch this connection URL
    export ELASTICSEARCH_NODE="https://<user>:<password>@<your-cluster-name>.bonsaisearch.net:443"
    ```
   
4. **Run the container**

   This command runs the proxy in a container, mapping port `9200` on your local machine to the proxy server.

   ```shell

   # Run the proxy container
   docker run \
       --network bonsai-blog-post  \
       --name node-proxy \
       -p 9200:9200 \
       -e ELASTICSEARCH_NODE="$ELASTICSEARCH_NODE" \
       bonsai-node-proxy
   ```

   The proxy is now running and accessible at **`http://localhost:9200`**.