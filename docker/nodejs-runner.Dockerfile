ARG REGISTRY_HOST
ARG NODE_IMAGE

FROM ${NODE_IMAGE} as runner
WORKDIR /usr/src/app
ONBUILD COPY --from=deps /usr/src /usr/src
ONBUILD COPY --from=builder /usr/src/app/dist/ ./dist/
ONBUILD COPY ./package.json .
ONBUILD RUN npm install --no-package-lock --production

