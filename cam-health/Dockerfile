ARG REGISTRY_HOST
ARG NODE_IMAGE
ARG PORT=1809

FROM ${REGISTRY_HOST}/streaming-types:latest as types

FROM ${NODE_IMAGE} as deps
ENV dir /usr/src/app
COPY --from=types ${dir}/ /usr/src/types/

FROM ${REGISTRY_HOST}/streaming-nodejs-base:latest as base
EXPOSE ${PORT}
CMD [ "npm", "start" ]
