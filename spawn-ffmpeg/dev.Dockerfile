ARG REGISTRY_HOST
ARG NODE_IMAGE
ARG PORT=1806

FROM ${NODE_IMAGE} as base
RUN apt-get update && \
    apt-get install -y libav-tools && \
    apt-get install -y ffmpeg

FROM base
WORKDIR /usr/src/app
EXPOSE ${PORT}
CMD [ "npm", "run", "dev" ]
