# Respawner

> The official, all-purpose Discord bot for **[Respawn Sync](https://respawnsync.com)** — levelling, moderation, fun, and community tooling for a reader-first gaming site.

[![Node.js](https://img.shields.io/badge/node-%E2%89%A520.0.0-brightgreen?logo=node.js&logoColor=white)](https://nodejs.org)
[![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?logo=discord&logoColor=white)](https://discord.js.org)
[![Module type](https://img.shields.io/badge/module-ESM-orange)](#tech-stack)
[![Status](https://img.shields.io/badge/status-early%20development-yellow)](#current-status)
[![License](https://img.shields.io/badge/license-source--available-blue)](./LICENSE)

---

## Table of contents

- [What is Respawner?](#what-is-respawner)
- [What is Respawn Sync?](#what-is-respawn-sync)
- [Feature set](#feature-set)
    - [1. Core & utility](#1-core--utility)
    - [2. Levelling & XP](#2-levelling--xp)
    - [3. Moderation](#3-moderation)
    - [4. Fun & games](#4-fun--games)
    - [5. Community & engagement](#5-community--engagement)
    - [6. Respawn Sync integrations](#6-respawn-sync-integrations)
    - [7. Server configuration](#7-server-configuration)
- [Current status](#current-status)
- [Tech stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

---

## What is Respawner?

Respawner is the Discord bot that powers the **Respawn Sync** community server. It's being built as an **all-purpose bot** rather than a single-purpose one: one codebase, one invite, everything the server needs.

Its job is to do four things well:

1. **Reward the regulars** — an XP/levelling system so the people who show up and help others get recognised, with cosmetic and role rewards.
2. **Keep the server sane** — a moderation suite (warns, mutes, bans, purge, auto-mod) with a proper audit trail, so staff actions are consistent and reviewable.
3. **Make it fun to hang out in** — dice, 8-ball, trivia, polls, memes, and other low-stakes commands that give people a reason to type in chat.
4. **Tie the Discord to the website** — surface new guides, reviews and tier lists in the server, let members self-assign game roles, and turn the community into the front door for the site.

Respawner is designed to run as a **single-bot, single-process** service that scales from one server (the official Respawn Sync server) to many, without a rewrite.

---

## What is Respawn Sync?

[Respawn Sync](https://respawnsync.com) is an independent, reader-first gaming site publishing **guides, reviews, tier lists and news**. It's run by one person who actually plays the games — no AI-generated listicles, no rewrites of the same press release.

- **Guides** are written from real playthroughs and stamped with the patch they were verified against (e.g. *How to Get the Oozed Camo in Black Ops 7 — All 36 Challenges*).
- **Reviews** are scored out of 10 and state how many hours were played and on what version (e.g. *Did Aniimo's release live up to the hype?* — **8/10**).
- **Tier lists** rank weapons, characters, builds and more.
- **Game hubs** collect everything for a title in one place — currently **Aniimo**, **Call of Duty: Modern Warfare 4**, **Call of Duty: Black Ops 7**, **Minecraft Dungeons II** and **Grand Theft Auto VI**.

Respawn Sync is actively building out its community presence, starting with its **official Discord server** — which is exactly what Respawner exists to serve.

---

## Feature set

Legend: ✅ live · 🟡 partially built · ⬜ planned

### 1. Core & utility

The boring stuff that has to work before anything else can.

| Feature | Command | Status | Notes |
| --- | --- | --- | --- |
| Latency & health check | `/respawn-ping` | ✅ | Reports bot latency and API round-trip. |
| Help menu | `/respawn-help [module]` | ⬜ | Auto-generated from the command registry; module filter (levelling / moderation / fun). |
| Bot stats | `/respawn-botinfo` | ⬜ | Uptime, server count, command count, Node & discord.js versions, memory usage. |
| Server info | `/respawn-serverinfo` | ⬜ | Member counts, boost tier, created date, owner, role/channel counts. |
| User info | `/respawn-userinfo [@user]` | ⬜ | Join date, account age, roles, moderation history summary. |
| Avatar | `/respawn-avatar [@user]` | ⬜ | Full-size avatar URL. |
| Invite / support links | `/respawn-invite` | ⬜ | Bot invite, website link, server invite. |
| Uptime | `/respawn-uptime` | ⬜ | Human-readable uptime since last boot. |

### 2. Levelling & XP

The retention engine. Members earn XP for being active, level up, and unlock rewards.

| Feature | Command | Status | Notes |
| --- | --- | --- | --- |
| Message XP | — | ⬜ | XP awarded per message with a **60-second cooldown** per user to stop spam-levelling. |
| Voice XP | — | ⬜ | Optional XP for time spent in voice channels, excluding AFK and muted/deafened. |
| Rank card | `/level-rank [@user]` | ⬜ | Image card: level, XP bar, server rank, avatar. |
| Leaderboard | `/level-top [page]` | ⬜ | Paginated top-10 (or top-100) with the requesting user's position pinned. |
| Role rewards | `/level-rewards` | ⬜ | Auto-assign/remove roles at level milestones (e.g. Lv.10 → `Regular`). |
| No-XP channels | `/level-blacklist` | ⬜ | Exclude channels such as `#bot-commands` from earning XP. |
| No-XP roles | `/level-blacklist` | ⬜ | Exclude roles such as muted or bot roles. |
| XP modifiers | `/level-multiplier` | ⬜ | Per-role or per-channel multipliers (e.g. double XP events). |
| Level-up messages | — | ⬜ | Configurable per server: channel or DM, with an option to keep it silent. |
| XP admin tools | `/level-set`, `/level-reset` | ⬜ | Set or wipe a user's XP; full-server reset behind a confirmation button. |
| Reset on leave | — | ⬜ | Optional: wipe XP when a member leaves. |

**Data model (planned):** a single `levels` table keyed on `(guild_id, user_id)` storing `xp`, `total_xp`, `level`, `last_message_at`, plus a `guild_settings` table for per-server configuration and a `level_rewards` table for role milestones.

### 3. Moderation

Everything staff need, with **case IDs and an audit log** so actions can be reviewed and reversed.

| Feature | Command | Status | Notes |
| --- | --- | --- | --- |
| Kick | `/mod-kick` | ⬜ | Requires a reason; notified via DM where possible. |
| Ban / temporary ban | `/mod-ban`, `/mod-tempban` | ⬜ | Duration parsing (`7d`, `12h`, `30m`); optional message-deletion window. |
| Unban | `/mod-unban` | ⬜ | Accepts a user ID for members no longer in the server. |
| Timeout / mute | `/mod-mute`, `/mod-unmute` | ⬜ | Native Discord timeouts, max 28 days. |
| Warn system | `/mod-warn`, `/mod-warnings` | ⬜ | Escalating automatic punishments (3 warns → timeout, 5 → ban), configurable. |
| Purge | `/mod-purge` | ⬜ | Bulk delete 1–100 messages, with optional user/bot/attachment filters. |
| Slowmode | `/mod-slowmode` | ⬜ | Set or clear per-channel slowmode. |
| Lock / unlock | `/mod-lock`, `/mod-unlock` | ⬜ | Toggle `@everyone` send-messages on a channel. |
| Nickname management | `/mod-nick` | ⬜ | Set or clear a member's nickname. |
| Notes | `/mod-note` | ⬜ | Non-punitive staff notes attached to a member's record. |
| Case lookup | `/mod-case` | ⬜ | Look up any case by ID; includes who, what, when, why. |
| Mod log channel | `/config modlog` | ⬜ | Every action embeds to a channel with case ID, staff member, reason and evidence. |
| Anti-spam | — | ⬜ | Duplicate-message and message-rate detection. |
| Anti-invite | — | ⬜ | Block Discord invite links, with an allowlist for partner servers. |
| Word filter | — | ⬜ | Per-server blocked-phrase list with regex support and a staff bypass role. |
| Anti-caps / anti-mass-mention | — | ⬜ | Threshold-based, auto-timeout on breach. |
| Anti-raid / join-lock | — | ⬜ | Auto-lock the server or kick new accounts during a raid spike. |

### 4. Fun & games

Low-stakes commands to fill the dead air.

| Feature | Command | Status | Notes |
| --- | --- | --- | --- |
| Magic 8-ball | `/fun-8ball <question>` | ⬜ | Classic 20-answer set. |
| Coin flip | `/fun-coinflip` | ⬜ | Heads, tails — or let it land on its edge, rarely. |
| Dice roller | `/fun-roll [sides] [count]` | ⬜ | Defaults to `1d6`, supports `4d20`-style notation later. |
| Rock paper scissors | `/fun-rps` | ⬜ | Button-based, plays against the bot. |
| Would you rather | `/fun-wyr` | ⬜ | Curated question pool. |
| Trivia | `/fun-trivia [category]` | ⬜ | Timed, scoreboard per server, with a gaming-leaning question set. |
| Meme / joke | `/fun-meme`, `/fun-joke` | ⬜ | Opt-in NSFW filter; source APIs configurable. |
| Text transformers | `/fun-clap`, `/fun-reverse`, `/fun-emojify` | ⬜ | Pure-text fun, no external requests. |
| Coin economy (stretch) | `/fun-balance`, `/fun-daily` | ⬜ | Optional virtual currency layered on top of XP — only if the community wants it. |

### 5. Community & engagement

Features that make the server feel alive and give members a reason to come back.

| Feature | Command / trigger | Status | Notes |
| --- | --- | --- | --- |
| **Auto-role on join** | `guildMemberAdd` | ✅ | Every new member is automatically granted the configured member role. |
| Welcome messages | `guildMemberAdd` | ⬜ | Customisable embed + banner, posted to a configured channel or sent as a DM. |
| Leave / goodbye messages | `guildMemberRemove` | ⬜ | Optional channel message. |
| Reaction roles | `/reaction-role` | ⬜ | Self-assign roles by reacting; includes game roles (see below). |
| Game roles | `/game-role` | ⬜ | Pick your games (`Aniimo`, `BO7`, `GTA VI`, …) to get pinged for relevant posts. |
| Polls | `/poll` | ⬜ | Up to 10 options, configurable duration, live vote counts, one vote per user. |
| Suggestions | `/suggest` | ⬜ | Threaded discussion with ✅ / ❌ voting and a staff decision log. |
| Starboard | `messageReactionAdd` | ⬜ | Reactions over a threshold get mirrored to a `#starboard` channel. |
| Tickets | `/ticket` | ⬜ | Button-driven private threads for support and review requests. |
| Join-to-create voice | `voiceStateUpdate` | ⬜ | Auto-provision temporary voice channels. |
| Confession / QOTD | ⬜ | ⬜ | Optional periodic engagement posts. |
| Birthday / anniversary roles | ⬜ | ⬜ | Celebrate member and server anniversaries. |

### 6. Respawn Sync integrations

The part that makes Respawner *Respawn Sync's* bot rather than an off-the-shelf one.

| Feature | Command / trigger | Status | Notes |
| --- | --- | --- | --- |
| New-post announcements | scheduled poll | ⬜ | Watches the site's sitemap/feed and posts new guides, reviews and tier lists to a `#new-posts` channel, pinging the relevant game role. |
| Guide / review search | `/rs-search <query>` | ⬜ | Searches respawnsync.com and returns matching guides, reviews and game hubs as embeds. |
| Latest review | `/rs-latest` | ⬜ | The newest review, with its score out of 10. |
| Game hub lookup | `/rs-game <name>` | ⬜ | Everything Respawn Sync has for a game — guides, reviews, tier lists, platforms. |
| Tier list lookup | `/rs-tierlist <game>` | ⬜ | Pulls the current tier list for a title, rendered in chat. |
| Review request intake | `/rs-request` | ⬜ | Members submit "please review this game" requests straight into a staff channel or ticket. |
| Guide request intake | `/rs-guide-request` | ⬜ | Members request a guide for a boss, camo grind or build. |
| LFG | `/rs-lfg <game>` | ⬜ | Looking-for-group posts with a join button and player count. |
| Affiliate-safe link sharing | — | ⬜ | Shared links stay clean; disclosure handled on-site. |

### 7. Server configuration

| Feature | Command | Status | Notes |
| --- | --- | --- | --- |
| Per-guild settings | `/config <module>` | ⬜ | All features above are toggleable per server and stored in the database, not in code. |
| Module toggles | `/config module <name> <on\|off>` | ⬜ | Disable levelling or starboard entirely in servers that don't want it. |
| Permission overrides | `/config perm <command> <role>` | ⬜ | Per-command role requirements on top of Discord permissions. |
| Staff role | `/config staffrole` | ⬜ | Which roles can use moderation commands. |
| Dev-only commands | — | ⬜ | Owner-only `eval`, `reload`, `shutdown`, gated by a bot-owner ID list. |
| Hot command reload | `/dev-reload` | ⬜ | Re-read the `commands/` directory without a restart. |

---

## Current status

Respawner is in **early development**. What exists today:

- ✅ A discord.js v14 client using the **Guilds** and **GuildMembers** intents.
- ✅ A file-based **slash command handler** that auto-loads every file in `commands/`.
- ✅ **Global slash command registration** on startup via the REST API.
- ✅ `/respawn-ping` — the first command, and the template for all others.
- ✅ **Auto-role on join** — new members are granted the configured member role.

Not yet present, and needed before the features above land:

- ⬜ A persistence layer (SQLite is the intended first target — zero-config, single file, easy to back up).
- ⬜ A per-guild settings/config system.
- ⬜ The additional gateway intents required for levelling and moderation (see below).
- ⬜ Structured logging.
- ⬜ A `.env.example` file (referenced by `.gitignore` but not yet committed).

> **A note on the auto-role:** the role ID is currently hard-coded in `index.js`. It should move into the configuration layer and become per-guild before Respawner is invited to any server beyond the official one.

---

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Runtime | **Node.js 20+** | Modern `async`/`await`, stable ESM, current LTS. |
| Language | **JavaScript (ESM)** | `"type": "module"` — top-level `await` is used for command loading. |
| Discord library | **[discord.js](https://discord.js.org) v14** | Full slash-command, interaction and gateway support. |
| Config | **[dotenv](https://www.npmjs.com/package/dotenv)** | Secrets stay in `.env`, never in git. |
| Database | *Planned:* **SQLite** (`better-sqlite3`) | Zero-config, single-file, trivially backed up. Postgres later if needed. |
| Scheduling | *Planned:* `node-cron` or `setInterval` | For temporary-ban expiry and site-feed polling. |
| Images | *Planned:* `@napi-rs/canvas` | For rank cards and welcome banners. |
| HTTP | Native `fetch` | Enough for talking to respawnsync.com. |

---

## Contributing

Respawner is primarily a solo project, but issues and suggestions are welcome via the [issue tracker](https://github.com/reubqnL/Respawner/issues).

If you'd like to contribute code:

1. Fork the repository and branch from `main`.
2. Match the existing style: ESM, `async`/`await`, semicolons, 4-space indentation.
3. Keep commands in their module folder and follow the [naming conventions](#conventions).
4. Never commit `.env` or any token.
5. Open a pull request describing what you added and how you tested it.

---

## License

Respawner is **source-available, not open source**. The code is published for viewing, personal study and local testing. You may not copy, re-host, redistribute, modify for public deployment, or use it in a commercial product without prior written consent.

See [LICENSE](./LICENSE) for the full terms.

---

Built with ☕ for the [Respawn Sync](https://respawnsync.com) community.