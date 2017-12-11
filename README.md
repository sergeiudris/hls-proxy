
## streaming

*enviroment variables are in `.env` and `run.sh` files

*services are described in .yml files

*be sure docker 17.11 or higher is installed, you probably need `Docker Edge` build

*on prod (host) docker is 17.03, so you need to uncomment `HOSTNAME` and `REGISTRY_HOST` in .env file for `'dc_prod pull'`  `'dc_prod up -d'` to work (passing from run.sh does not work)


### run locally ###
```shell
# do once
$ sh run.sh pull_tag_local
# build and start everything
$ sh run.sh dc_local up -d --build
# stop everything and remove containers
$ sh run.sh dc_local down
```

### build for prod ###
```shell
# do once
$ sh run.sh pull_tag_remote
# build and start everything
$ sh run.sh dc_remote build
# push to remote registry
$ sh run.sh dc_remote push
```

### run on prod ###
```shell
# on the target machine
# pull from local registry
$ sh run.sh dc_prod pull
# run without building
$ sh run.sh dc_prod up -d

```

*`dc_local` , `dc_remote`, `dc_prod` are aliases for `docker-compose`. check `docker-compose` docs for commands like `'up -d'` `'build'` etc
