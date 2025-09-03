# Example Bonsai Elasticsearch Interleaving Proxy (Nginx)

An example nginx proxy Elasticsearch (v7.10.2) cluster and forwards all requests at port 9200 to that cluster.

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

   Go to your bonsai cluster's credentials page, and create fly.io secrets for the host, username, and password of your
   cluster:

   ```
   fly secrets set \
     BONSAI_HOST="REPLACE-ME-1234567890.us-east-1.bonsaisearch.net:443" \
     BONSAI_USERNAME="<from your bonsai cluster's credentials page>" \
     BONSAI_PASSWORD="<from your bonsai cluster's credentials page>"
   ```

4. **Deploy**

   ```shell
   fly deploy --flycast
   ```

   Once deployed, the nginx proxy will be deployed into your Fly organization's internal network, available via the
   [Flycast](https://fly.io/docs/networking/flycast/) proxy at <your-app-name>.flycast:9200.

-----

### Local

1. **Create the Docker network**

   ```shell
   docker network create bonsai-blog-post
   ```

2. **Build the Docker image**

   ```shell
   docker build -t bonsai-nginx-proxy .
   ```

3. **Set environment variables**

   Visit the credentials page on your Bonsai.io cluster overview to fetch these, then
   set them in your terminal's environment:

   ```shell
   export BONSAI_HOST="REPLACE-ME-1234567890.us-east-1.bonsaisearch.net:443"
   export BONSAI_USERNAME="<from your bonsai cluster's credentials page>"
   export BONSAI_PASSWORD="<from your bonsai cluster's credentials page>"
   ```

4. **Run the container**

   This command runs the proxy in a container, mapping port `9200` on your local machine to the proxy server.

   ```shell
   docker run \
       --network bonsai-blog-post \
       --name nginx-proxy \
       -p 9200:9200 \
       -e BONSAI_HOST="$BONSAI_HOST" \
       -e BONSAI_USERNAME="$BONSAI_USERNAME" \
       -e BONSAI_PASSWORD="$BONSAI_PASSWORD" \
       bonsai-nginx-proxy
   ```
   
   The proxy is now running and accessible at **`http://localhost:9200`**.
