ARG REGISTRY_HOST
ARG NODE_IMAGE
ARG PORT=1806

FROM ${NODE_IMAGE} as base
RUN apt-get update && \
    apt-get install -y libav-tools && \
    apt-get install -y ffmpeg

FROM ${REGISTRY_HOST}/streaming-types:latest as types

FROM ${NODE_IMAGE} as deps
ENV dir /usr/src/app
COPY --from=types ${dir}/ /usr/src/types/

FROM ${REGISTRY_HOST}/streaming-nodejs-builder as builder

FROM base
WORKDIR /usr/src/app
COPY --from=deps /usr/src /usr/src
COPY ./package.json .
RUN npm install --no-package-lock --production
COPY --from=builder /usr/src/app/dist/ ./dist/
EXPOSE ${PORT}
CMD [ "npm", "start" ]
