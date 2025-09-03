#!/bin/sh
set -e

if [ -z "$BONSAI_USERNAME" ] || [ -z "$BONSAI_PASSWORD" ] || [ -z "$BONSAI_HOST" ]; then
  echo "---"
  echo "ERROR: The environment variables BONSAI_USERNAME, BONSAI_PASSWORD, and BONSAI_HOST must all be set." >&2
  echo "---"
  exit 1
fi

# Create the Authorization header and export it so envsubst can use it.
export BONSAI_AUTH_HEADER="Basic $(echo -n "$BONSAI_USERNAME:$BONSAI_PASSWORD" | base64)"

# Replace env variables
envsubst '$BONSAI_HOST,$BONSAI_AUTH_HEADER' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

echo "Configuration complete. Starting Nginx..."
exec nginx -g 'daemon off;'
