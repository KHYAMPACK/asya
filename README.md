# Asya quiz

Cute Turkish mobile quiz. Deploy to Vercel, then send her:

```
sana küçük bir şey yaptım 💌

https://YOUR-APP.vercel.app
```

## Setup

1. Copy `.env.example` → `.env.local` and fill:
   - Upstash Redis REST URL + token
   - `ADMIN_PASSWORD` for `/answers`
2. `npm run dev` locally, or push to GitHub → import in Vercel and add the same env vars.

Private answers: `https://YOUR-APP.vercel.app/answers`
