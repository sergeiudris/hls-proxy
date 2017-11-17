ARG REGISTRY_HOST
ARG NODE_IMAGE
ARG PORT=1811
ARG CADDY_VERSION=v0.10.10

FROM ${REGISTRY_HOST}/streaming-types:latest as types

FROM ${NODE_IMAGE} as deps
ENV dir /usr/src/app
COPY --from=types ${dir}/ /usr/src/types/

FROM ${NODE_IMAGE} as builder
# RUN apk add --no-cache --virtual .build-deps python make g++
COPY --from=deps /usr/src /usr/src
WORKDIR /usr/src/app
COPY ./package.json .
RUN npm install --no-package-lock
COPY . .
RUN npm run build

FROM ${NODE_IMAGE}
RUN apt-get update && \
  apt-get install -y libav-tools && \
  apt-get install -y ffmpeg
# RUN curl "https://caddyserver.com/download/build?os=linux&arch=amd64&features=DNS%2Cawslambda%2Ccors%2Cexpires%2Cfilemanager%2Cgit%2Chugo%2Cipfilter%2Cjsonp%2Cjwt%2Clocale%2Cmailout%2Cminify%2Cmultipass%2Cprometheus%2Cratelimit%2Crealip%2Csearch%2Cupload%2Ccloudflare%2Cdigitalocean%2Cdnsimple%2Cdyn%2Cgandi%2Cgooglecloud%2Clinode%2Cnamecheap%2Crfc2136%2Croute53%2Cvultr" \
#   | tar --no-same-owner -C /usr/bin/ -xz caddy
RUN curl https://getcaddy.com | bash -s personal http.git,dns
WORKDIR /usr/src/app
# COPY --from=deps /usr/src /usr/src
COPY ./package.json .
# RUN npm install --no-package-lock --production
COPY --from=builder /usr/src/app/dist/ ./dist/
COPY ./Caddyfile ./
EXPOSE ${PORT}
CMD [ "caddy", "--conf", "/usr/src/app/Caddyfile" ]
