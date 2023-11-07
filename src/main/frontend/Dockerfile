# Stage 1
FROM node:16 as build-stage
WORKDIR /client
COPY package.json .
RUN npm install
COPY . .
ARG REACT_APP_SERVER_BASEURL
ENV REACT_APP_SERVER_BASEURL=$REACT_APP_SERVER_BASEURL
RUN npm run build

# Stage 2
FROM nginx:1.23.1-alpine
COPY --from=build-stage /client/build /usr/share/nginx/html
EXPOSE $REACT_DOCKER_PORT
CMD nginx -g 'daemon off;'