# ft_transcendence
### FIRST THING FIRST
DON'T FORGET TO PULL THE NEW CHANGES EVERYDAY

### setup
First, you might encounter a problem after runing the `docker-compose up`,
the error says:
``
failed to solve with frontend dockerfile.v0: failed to build LLB:
failed to compute cache key: "/.env" not found: not found
``
you will need to add the 2 following environment variable to fix the issue:
```
export DOCKER_BUILDKIT=0
export COMPOSE_DOCKER_CLI_BUILD=0
```
then you will find in the root folder a .env.example file, change it to .env

### How to contribute

Please create a pull request, automatically, someone from the team will be assigned as a reviewer to your PR.

### Important command
To run the application, we have to use the following command:
```
docker-compose up
```

To enter the psql database inside the container, run:
```
psql -h localhost -U postgres
```

### How to work with yarn and docker
In the `api` service config, we defined `node_modules` as an anonymous volume to prevent our host files from overriding the directory. So if we were to add a new yarn package by using `yarn install`, the package wouldn’t be available in the Docker context, and the application would crash.

Even if you run `docker-compose down` and then `docker-compose up` again in order to start over, the `volume` would stay the same. It won’t work because anonymous volumes aren’t removed until their parent container is removed.

To fix this, we can run the following command:
```
docker-compose up --build -V
```
The `--build` parameter will make sure the npm install is run (during the build process), and the `-V` argument will remove any anonymous volumes and create them again.
