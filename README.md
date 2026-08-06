# Şevval quiz

Cute Turkish mobile quiz. Deploy to Vercel, then send her:

```
sana küçük bir şey yaptım 💌

https://YOUR-APP.vercel.app
```

## Setup

1. Locally: `npm run dev` — sessions save to `data/submissions.json` (no env needed).
2. On Vercel: add Upstash Redis (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) so answers persist across servers.

Open answers anytime (no password): `https://YOUR-APP.vercel.app/answers`
