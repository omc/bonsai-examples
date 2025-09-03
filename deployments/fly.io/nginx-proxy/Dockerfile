FROM nginx:1.27-alpine

RUN apk add --no-cache gettext coreutils

RUN rm /etc/nginx/nginx.conf

COPY nginx.conf.template /etc/nginx/nginx.conf.template

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 9200