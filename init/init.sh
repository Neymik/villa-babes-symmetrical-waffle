
# run from root directory

docker-compose -f init/docker-compose.yml up -d

bun ci
bun run init/updateConfig.js
bun test
bun build
bun run app.js
