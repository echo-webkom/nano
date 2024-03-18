# Kaffe as a Service

Bruker Cloudflare for hosting og med Workers.

## Kjør lokalt

```bash
pnpm i
pnpm run dev
```

## Deploy

```bash
pnpm run deploy
```

## Testing

```bash
pnpm run test
```

## Endepunkter

### `GET /`

Returnerer antall prikker på kaffemaskinen

### `POST /strike`

Legger til en rapport om at det er skittent på kjøkkenet. Om det kommer to rapporter på under 1 time, vil det bli lagt til en prikk på kaffemaskinen.

### `GET /reset`

Nullstiller antall prikker på kaffemaskinen.
