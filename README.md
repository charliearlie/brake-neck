# Bidhub

An eCommerce website built on a modern tech stack

## Development

Clone repository

Open project in IDE and fill in the `.env.template` and remove the `.template` suffix. (should be `.env`)

From your terminal:

```sh
cd bidhub
pnpm install
```

If the `pnpm install` doesn't show anything to do with Prisma, then also run

```sh
pnpm db:generate
```

Run the application

```sh
pnpn dev
```

### View and manipulate database data

Data can be viewed in Prisma's studio. To do this run:

```sh
pnpm db:studio
```
