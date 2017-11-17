ARG NODE_IMAGE
ARG REGISTRY_HOST

FROM ${NODE_IMAGE} as deps
WORKDIR /usr/src/

FROM ${REGISTRY_HOST}/streaming-nodejs-builder as builder
FROM ${REGISTRY_HOST}/streaming-nodejs-runner as runner

