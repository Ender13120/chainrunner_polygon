# On-Chain Runner & Backend for https://galaxythrone.io

Automatically checks on-chain state on Polygon and triggers custom on-chain transactions depending on the state.

Also indexes & serves on-chain data for quicker UX on the game frontend

Using Nestjs + Typescript & Prisma/Docker



Outdated compared to private live version, updating it as I go from milestone to milestone





### to run the backend create an .env in the project directory with:

```
DATABASE_URL="postgresql://postgres:123@localhost:5432/nest?schema=public"

CONTRACT_ADDRESS=

PROVIDER_RPC=

PRIVATE_KEY_SHARED=

PUBLIC_ADDR=
```

You'd need docker running in the background, then to run the DB:

docker compose up dev-db 


And after a couple seconds 
yarn start:dev
should run the server on port 3000

to checkout the db in the browser you can run:

npx prisma studio
