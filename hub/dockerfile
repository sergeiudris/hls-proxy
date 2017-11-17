ARG REGISTRY_HOST
ARG NODE_IMAGE
ARG PORT=1805
ARG PORT_WSS=1100

FROM ${REGISTRY_HOST}/streaming-types:latest as types

FROM ${NODE_IMAGE} as deps
ENV dir /usr/src/app
COPY --from=types ${dir}/ /usr/src/types/

FROM ${REGISTRY_HOST}/streaming-nodejs-builder as builder
FROM ${REGISTRY_HOST}/streaming-nodejs-runner as runner

EXPOSE ${PORT} ${PORT_WSS}

CMD [ "npm", "start" ]
