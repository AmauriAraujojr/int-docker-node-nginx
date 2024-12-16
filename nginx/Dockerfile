FROM nginx:latest

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir /usr/src/app -p && touch /usr/src/app/index.js