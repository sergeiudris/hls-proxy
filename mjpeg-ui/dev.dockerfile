FROM node:8.1.0-alpine

# RUN apt-get -qq update && apt-get install --no-install-recommends -qqy \
#     curl \
#     ca-certificates \
#     openssh-client \
#     git

WORKDIR /usr/src/app

# COPY . /usr/src/app

# RUN npm i
# RUN npm run build

EXPOSE 1801
CMD [ "yarn","run","dev"]
