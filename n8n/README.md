# Salma · Habibi Love Bot — n8n setup 💖

This workflow powers the **Habibi** chat bubble on `/salma`. It keeps your
OpenAI/ChatGPT key **server-side inside n8n** — the key is never shipped to the
browser. The frontend only calls your n8n webhook URL.

Flow: `Webhook (GET) → Persona & Message → ChatGPT (OpenAI) → Respond to Salma`

## 1. Import the workflow

1. Open n8n → **Workflows** → **Import from File**.
2. Choose `salma-habibi-workflow.json`.

## 2. Add your OpenAI key (as an n8n credential — stays secret)

1. In the **ChatGPT (OpenAI)** node → **Credential for Header Auth** → **Create New**.
2. Set:
   - **Name:** `Authorization`
   - **Value:** `Bearer sk-...your-openai-key...`
3. Save. (The key lives only in n8n, encrypted — not in the repo, not in the bundle.)

> Prefer a cheaper/smarter model? Edit the `model` field in the **ChatGPT (OpenAI)**
> node's JSON body (default: `gpt-4o-mini`).

## 3. Activate & grab the URL

1. Toggle the workflow to **Active** (top right).
2. Open the **Webhook** node and copy the **Production URL**
   (looks like `https://YOUR-N8N-HOST/webhook/salma-habibi`).

## 4. Wire it to the site

Add a GitHub repository secret so the deploy build injects it:

- **Name:** `VITE_SALMA_CHAT_WEBHOOK_URL`
- **Value:** the Production webhook URL from step 3

Next deploy to `main`, and Habibi is live. The frontend sends the question as a
`message` query param and reads back `{ "output": "..." }`.

## Test it quickly

```bash
curl "https://YOUR-N8N-HOST/webhook/salma-habibi?message=Donne-moi%20du%20courage%20mon%20amour"
```

You should get something like:
`{ "output": "Tu vas tout déchirer aujourd'hui, ma Salma... — Fares 💖" }`

## Notes

- Until the secret is set, the bot still works with sweet **offline fallback**
  messages (see `services/salmaChatService.ts`), so Salma is never left hanging.
- The loving "Habibi" persona lives in the **Persona & Message** node's
  `systemPrompt` — tweak the wording there anytime to make it even more *you*.
