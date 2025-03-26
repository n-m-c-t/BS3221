# BS3221

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