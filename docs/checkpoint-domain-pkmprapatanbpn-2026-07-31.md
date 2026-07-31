# Checkpoint — Custom domain pkmprapatanbpn.web.id (idwebhost → Vercel)

**Branch:** `main`
**Date:** 2026-07-31 (evening)
**Status:** ⏳ IN PROGRESS — NS delegation switch pending (idwebhost → Vercel)

## Context

User bought domain `pkmprapatanbpn.web.id` at idwebhost (member.idwebhost.com).
Goal: serve https://puskesmas-prapatan-web.vercel.app under `pkmprapatanbpn.web.id`.

## Done ✅

### 1. Vercel side — domain added via CLI

Vercel CLI 58.1.0 installed globally (`%APPDATA%\npm\vercel.cmd`), logged in as `saputrajihad-1763`.

```bash
vercel domains add pkmprapatanbpn.web.id puskesmas-prapatan-web
# > Success! Domain pkmprapatanbpn.web.id added to project
```

Project: `puskesmas-prapatan-web` (org `team_xwjzw1GS8gVV1nknA2w7EUGF`, project `prj_AHIAmIr9NJEAqoQj3o4zX3tBgtuD`).
`vercel domains verify` → project verified; DNS invalid (expected, DNS not pointed yet).

### 2. idwebhost side — DNS records added (attempt 1: zone REFUSED)

User added via idwebhost DNS panel (Jenis Record form: Nama Host / Jenis Record / Alamat):

| # | Nama Host | Jenis Record | Alamat |
|---|---|---|---|
| 1 | pkmprapatanbpn.web.id (`@`) | A | 216.198.79.1 |
| 2 | pkmprapatanbpn.web.id (`@`) | A | 64.29.17.1 |
| 3 | www | CNAME | cname.vercel-dns.com |

**Problem found:** idwebhost nameservers (203.161.184.96, 203.161.184.82, 202.52.146.225, 103.30.147.9) return `rcode=REFUSED` for the zone — "lame delegation". Zone saved in panel but never published/activated on their authoritative NS. Verified via DNS-over-HTTPS (dns.google + Cloudflare) — UDP 53 blocked from this machine, use `https://dns.google/resolve?name=...&type=...` for checks.

### 3. Fix chosen — switch nameservers to Vercel

User changed nameservers at idwebhost (Domain → manage → nameserver settings):

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

idwebhost UI warned "setiap pergantian NS butuh 24 jam" (worst case; usually faster).

## Poll results (NS delegation @ registry)

Checked via `curl https://dns.google/resolve?name=pkmprapatanbpn.web.id&type=NS`:

| Time | NS |
|---|---|
| 18:18–18:23 | still `ns1.idwebhost.id` / `ns2.idwebhost.id` (6 polls, 60s apart) |

Delegation not switched yet. PANDI registry update pending.

## Next steps (run once NS shows vercel-dns.com)

```bash
# 1. Add DNS records on Vercel (after delegation switches to vercel-dns.com)
vercel dns add pkmprapatanbpn.web.id A 216.198.79.1
vercel dns add pkmprapatanbpn.web.id A 64.29.17.1
vercel dns add www.pkmprapatanbpn.web.id CNAME cname.vercel-dns.com

# 2. Verify
vercel domains verify pkmprapatanbpn.web.id

# 3. Swap env vars (order matters: only after domain resolves, else NextAuth login breaks on both domains)
vercel env rm NEXTAUTH_URL production
vercel env rm NEXT_PUBLIC_SITE_URL production
vercel env add NEXTAUTH_URL production        # https://pkmprapatanbpn.web.id
vercel env add NEXT_PUBLIC_SITE_URL production # https://pkmprapatanbpn.web.id

# 4. Redeploy
vercel --prod

# 5. SSL cert auto-provisions ~1min after DNS valid; verify HTTPS
```

Note: `vercel env pull` redacts values as `[SENSITIVE]` — cannot read existing values via CLI.

## Lessons / gotchas

1. **idwebhost DNS zone can be REFUSED (lame delegation)** even when panel shows records saved — records are saved but not published to their NS. Don't blame record format; check authoritative response.
2. **Outbound UDP 53 blocked on this machine** (8.8.8.8, 1.1.1.1, idwebhost NS all timeout) — use DNS-over-HTTPS via curl instead: `https://dns.google/resolve?name=X&type=A`.
3. A records pair `216.198.79.1` / `64.29.17.1` = current Vercel anycast for this project; www via CNAME `cname.vercel-dns.com`.
4. Env swap BEFORE DNS resolves breaks admin login on both domains (NextAuth `redirect_uri` mismatch). Sequence: DNS → env → redeploy.
5. Vercel CLI path on this Windows box: `C:\Users\saput\AppData\Roaming\npm\vercel.cmd` (not on PATH in some shells).

## Related env vars (Vercel production, all encrypted)

SMTP_HOST/USER/PASS/PORT, PENGADUAN_TO (pengaduan email), NEXT_PUBLIC_SITE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, POSTGRES_URL (+ POSTGRES_*).
