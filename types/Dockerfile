ARG NODE_IMAGE

FROM ${NODE_IMAGE} as builder
# RUN apk add --no-cache --virtual .build-deps python make g++
WORKDIR /usr/src/app
COPY ./package.json .
RUN npm install --no-package-lock
COPY . .
RUN npm run compile

FROM ${NODE_IMAGE}
ENV dirname /usr/src/app
WORKDIR ${dirname}/
COPY --from=builder ${dirname}/package.json ${dirname}/dist/ ${dirname}/
COPY --from=builder ${dirname}/dist/ ${dirname}/dist/
