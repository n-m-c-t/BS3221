# BS3221

## Deployment Steps

Docker build of each services
```sh
docker build -f Dockerfile.webpage -t bs3221containerregistry.azurecr.io/bs3221-webpage:latest.

docker build -f Dockerfile.server -t bs3221containerregistry.azurecr.io/bs3221-server:latest.
```

In powershell terminal, authenticate with Azure-CLI
```sh
az login

az acr login --name bs3221ContainerRegistry

docker push bs3221containerregistry.azurecr.io/bs3221-webpage:latest

docker push bs3221containerregistry.azurecr.io/bs3221-server:latest
````

## Local Testing using Makefile

Start everything in detached mode, use:
```sh
make up
```

Stop all services, use:
```sh
make down
```

Restart everything, use:
```sh
make restart
```

Check logs, use:
```sh
make logs
```

Run the frontend manually, use:
```sh
make web
```

Run the backend manually, use:
```sh
make server
```


## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve BS3221
```

To create a production bundle:

```sh
npx nx build BS3221
```

To see all available targets to run for a project, run:

```sh
npx nx show project BS3221
```