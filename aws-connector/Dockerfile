FROM node:alpine AS build

WORKDIR /aws-connector

COPY src .
COPY package.json .
COPY package-lock.json .
COPY tsconfig.* ./

RUN npm ci
RUN npm run build && npm prune --production

FROM node:alpine
WORKDIR /aws-connector
RUN adduser --system --uid 1001 aws-connector

COPY --from=build /aws-connector/dist /aws-connector/dist
COPY --from=build /aws-connector/package.json /aws-connector/package.json
COPY --from=build /aws-connector/node_modules /aws-connector/node_modules
COPY --from=build /aws-connector/tsconfig.* /aws-connector/

RUN chown -R aws-connector /aws-connector/*
USER aws-connector

CMD npm run start:prod
EXPOSE 3000