
# run from root directory

docker-compose -f init/docker-compose.yml up -d

bun ci
# bun run init/updateConfig.js
bun test
# bun build
pm2 kill
pm2 start init/pm2.config.cjs
pm2 save
