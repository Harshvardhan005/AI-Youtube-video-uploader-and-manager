# AutoTube AI — Autonomous YouTube Channel Manager

> **"Upload your finished video. AutoTube AI handles the rest — safely."**

AutoTube AI is a desktop-based YouTube channel management platform engineered with an autonomous agent architecture. Designed for creators, media networks, and automated channels, it accepts finalized video assets and autonomously manages content analysis, metadata optimization, thumbnail generation, copyright screening, scheduling, multi-channel publishing, analytics retrieval, and competitor intelligence.

---

## Architecture Overview

AutoTube AI is structured around dedicated intelligence agents:

```
                  ┌───────────────────────────────┐
                  │    User Final Video Asset     │
                  └───────────────┬───────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│               AutoTube Autonomous Publishing Pipeline           │
│                                                                 │
│ 1. Content & Topic Extraction Engine                            │
│    └── Topic modeling, category resolution, language detection │
│ 2. AI SEO & Metadata Studio                                     │
│    └── High-CTR title variants, description, tags, hashtags     │
│ 3. AI Thumbnail Studio                                          │
│    └── Contrast composition, visual layout, typography styling  │
│ 4. Pre-Upload Copyright Safety Agent                            │
│    └── Audio acoustic fingerprinting & visual watermark check   │
│ 5. Private Upload Ingestion                                     │
│    └── Google OAuth 2.0 + YouTube Data API v3 (private mode)   │
│ 6. Post-Upload Content ID & Restrictions Sentinel               │
│    └── Transcoding monitor, policy check, claim safeguard       │
│ 7. Autonomous Scheduler & Publisher                             │
│    └── Audience velocity matching, channel rules, public release│
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Capabilities

### 1. Complete Autonomous Publishing
- **Autonomous Ingestion**: Drag-and-drop any finalized MP4, MOV, MKV, or AVI file.
- **Content Analysis**: Identifies video topic, target audience, content category, and language automatically.
- **SEO Optimization**: Generates 5+ title variants with SEO scoring, description copy, optimized tags, and hashtags.
- **Smart Thumbnail Studio**: Generates high-contrast visual concepts with device mockup previews (mobile & desktop).
- **Private Ingestion First**: Uploads strictly as `private` initially to allow YouTube transcoding and Content ID checks to complete.
- **Publishing Safeguard**: Only transitions from private to public/scheduled once all copyright checks pass cleanly.

### 2. Copyright Protection System
- **Pre-Upload Screening**: Scans audio tracks against acoustic fingerprint databases and checks video frames for visual watermarks and matched footage.
- **Timestamped Risk Reports**: Displays matched segment timestamps (e.g. `3:42 - 5:18`), match likelihood, and severity.
- **Strict Distinction**: AI-detected risk indicators are clearly distinguished from verified YouTube Content ID claims.
- **Withhold Policy**: If a warning or claim is detected, or if check results time out, videos are strictly withheld in `private` mode. AutoTube **never** automatically disputes claims or attempts to bypass copyright systems.
- **Licensed Assets Vault**: Configure approved licenses and whitelist owned audio tracks.

### 3. YouTube Studio Account Connection
- **Official Google OAuth 2.0**: Connect multiple channels with official YouTube scopes (`youtube.upload`, `youtube.readonly`, `yt-analytics.readonly`).
- **Channel Routing Rules**: Configure per-channel automation rules, default visibility, and publishing schedules.
- **Zero Scraping**: Operates exclusively via authorized Google APIs; credentials are stored locally.

### 4. YouTube Studio Analytics Intelligence
- **Authorized Reports**: Tracks views, watch time, average view duration, subscribers, impressions, CTR, and revenue.
- **Channel Comparisons**: Cross-channel performance matrix and top-performing video rankings.
- **Audience Demographics**: Traffic sources, viewer geography, and device breakdown.

### 5. Autonomous Publishing Engine & Controls
- **Full Autopilot Mode**: Hands-off processing from file drop to public release.
- **Global Emergency Pause**: Instant one-click kill-switch pausing all automated publishing across all channels.
- **Publishing Windows**: Configure allowed publishing hours and daily upload limits to prevent channel spam flags.
- **Audit Logging**: Comprehensive timestamped logs of every action, decision, and API call.

---

## Application Navigation

- **Dashboard**: High-level command center with AI Core visualization, velocity metrics, and active queue.
- **Upload Studio**: Drag-and-drop upload zone with real-time 8-stage stepper.
- **AI Metadata Studio**: Title variant selector with character counters, SEO scoring, and description/tag generation.
- **Thumbnail Studio**: 16:9 thumbnail concept explorer with mobile/desktop device mockups and A/B recommendations.
- **Publishing Calendar**: Month grid and scheduled pipeline with optimal AI time slot suggestions.
- **YouTube Channels**: Channel card manager, default selection, and Google OAuth connection.
- **YouTube Studio Analytics**: Comprehensive interactive charts (Views, Watch Time, Traffic Sources, Demographics).
- **Copyright Safety Center**: Active scans, timestamped risk reports, licensed asset inventory, and policy settings.
- **Competitor Intelligence**: Public competitor tracking, content gap analysis, and upload frequency comparison.
- **Trend Research**: Real-time trending topics, growth velocity, and AI-generated video concept recommendations.
- **AI Activity Center**: Live autonomous log, task success rates, and accumulated AI memory.
- **Automation Settings**: Autopilot toggles, emergency pause, daily caps, and publishing rules.
- **Notifications**: System notification drawer with error, warning, and success filtering.
- **Settings**: Local API credentials, dark SaaS theme options, storage usage, and system diagnostics.

---

## Getting Started

### Development
```bash
# Run web preview
npm run dev:web

# Run full desktop app (Vite + Electron)
npm run dev
```

### Production Build
```bash
# Compile and package web assets
npm run build

# Package Electron executable
npm run build:electron
```
