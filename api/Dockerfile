# development
# FROM node:18.12.1-alpine AS base
FROM node:lts-bullseye-slim AS base

WORKDIR /usr/src/api

COPY [ "package.json","yarn.lock*" , "./" ]

FROM base AS development

RUN yarn install --frozen-lockfile

# prisma engine requires openssl in order to work properly (ex: npx prisma generate)
RUN apt-get update && apt-get -y install openssl && apt-get install -y procps

COPY . .

RUN yarn prisma generate

CMD [ "yarn", "start:dev" ]


# Production
FROM base AS prod

RUN yarn install --frozen-lockfile --production

RUN apk add openssl

COPY . .

RUN yarn add global @nestjs/cli

RUN yarn build

CMD [ "yarn", "start:prod" ]


## Instructions:
## ------------
#yarn install --frozen-lockfile --production

#--production: Yarn will not install any package listed in devDependencies if the NODE_ENV environment variable is set to production. 
#              Use this flag to instruct Yarn to ignore NODE_ENV and take its production-or-not status from this flag instead.

#--frozen-lockfile: Don’t generate a yarn.lock lockfile and fail if an update is needed.

#docker build --target dev --tag nest-dock .


#docker run --detach --publish 3000:3000 nest-dock

