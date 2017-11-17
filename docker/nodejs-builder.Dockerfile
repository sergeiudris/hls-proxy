ARG REGISTRY_HOST
ARG NODE_IMAGE

FROM ${NODE_IMAGE} as builder
# RUN apk add --no-cache --virtual .build-deps python make g++
ONBUILD COPY --from=deps /usr/src /usr/src
WORKDIR /usr/src/app
ONBUILD COPY ./package.json .
ONBUILD RUN npm install --no-package-lock
ONBUILD COPY . .
ONBUILD RUN npm run build
