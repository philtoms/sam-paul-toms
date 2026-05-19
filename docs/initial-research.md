# Music Portfolio Website — Research Report (2025)

## 1. Platform Comparison

| Platform               | Cost/mo                | Design Ctrl | Audio Player   | SEO       | Merch    | Calendar | Open Source | Effort    |
| ---------------------- | ---------------------- | ----------- | -------------- | --------- | -------- | -------- | ----------- | --------- |
| Bandcamp               | $0 (+10-15% rev share) | Low         | Excellent      | Poor      | Built-in | None     | No          | Low       |
| SoundCloud             | $0-16                  | Very Low    | Excellent      | Poor      | None     | None     | No          | Low       |
| Wix Music              | $0-36                  | High        | Basic          | Good      | Built-in | Built-in | No          | Low-Med   |
| Squarespace Music      | $16-65                 | Medium      | Good           | Good      | Built-in | Built-in | No          | Low-Med   |
| WordPress + plugins    | $3-30                  | Very High   | Good-Excellent | Excellent | Built-in | Built-in | Yes         | Medium    |
| Hugo/Jekyll/11ty/Astro | $0 (domain only)       | Very High   | Custom         | Excellent | Link out | Link out | Yes         | High      |
| Next.js/React          | $0-20                  | Maximum     | Custom         | Excellent | Custom   | Custom   | Yes         | Very High |

**Key insight**: Dedicated platforms (Bandcamp, SoundCloud) offer easy setup but involve vendor lock-in, limited SEO, and recurring costs. Self-hosted options require more effort but give full ownership, zero/minimal recurring costs, and the best performance.

### Bandcamp

- Free to create; 10-15% of digital sales, 10% of merch
- Excellent built-in audio player, merch store, fan community, high audio quality (FLAC)
- Bandcamp Fridays (artists get 100% of sales)
- Weak SEO, no custom domain on free tier, no gig calendar, limited design control
- Best as a supplement (sales hub) rather than primary portfolio

### SoundCloud

- Free tier (3hrs upload); Next $8.33/mo; Pro $16.50/mo
- Huge discovery ecosystem, embeddable everywhere
- No merch/store, declining monetization, ads on free tier
- Best for discovery/sharing, not as a portfolio

### Wix Music

- $0-36/mo; 900+ templates, drag-and-drop
- Built-in ecommerce, SEO tools, app marketplace
- Proprietary (hard to migrate), slow page speeds, basic audio player
- Good for visual design flexibility without coding

### Squarespace Music

- $16-65/mo; beautiful music-specific templates
- All-in-one (site + store + calendar), great mobile
- Expensive, limited plugins, vendor lock-in

---

## 2. Key Features Every Music Portfolio Needs

### Must-Have

1. **Audio Player** — Persistent/sticky player across page navigation, playlist with play/pause/skip, progress bar, volume. Support MP3/FLAC/OGG.
2. **Track/Release Listing** — Album art, title, duration, release date. Grouped by album/EP/single. Links to streaming platforms.
3. **Artist Bio/About** — Photo, bio text, genre tags, press quotes, contact form.
4. **Responsive/Mobile-First** — 60%+ of visitors on mobile. Touch-friendly player controls.
5. **SEO** — Custom titles/meta per release, Open Graph/Twitter Cards with album art, structured data (MusicRecording schema), fast load times.

### Should-Have

6. **Gig/Event Calendar** — Upcoming shows with date, venue, ticket link. Options: Bandsintown/Songkick embed or custom.
7. **Email Signup** — Embed from Mailchimp, Buttondown, or Resend. Critical for direct-to-fan communication.
8. **Streaming Platform Links** — "Listen On" links to Spotify, Apple Music, YouTube Music, etc.
9. **Merch Store** (or links to one) — WooCommerce, Snipcart, or link to Bandcamp/BigCartel.

### Nice-to-Have

10. **Social Proof** — Press logos, playlist placement screenshots, follower counts
11. **Blog/News** — Release announcements, behind-the-scenes (good for SEO)
12. **Video Section** — Music videos, live clips (embed from YouTube/Vimeo)
13. **Analytics** — Plausible (privacy-friendly) or Umami (self-hosted, free/open-source)
14. **Accessibility** — Alt text, keyboard-navigable player, ARIA labels

---

## 3. Design Trends (2025)

- **Dark mode by default** — matches music aesthetic, reduces eye strain
- **Full-screen hero** — background video or animated gradients
- **Minimal typography** — one display font + one body font (often variable fonts)
- **Large album art** as the visual anchor (not small thumbnails)
- **Radical minimalism** — the best sites say less, not more (see examples below)
- **Micro-animations** on hover (play button morphs, album art slight zoom)
- **Streaming integrations** — "Listen everywhere" link pages, pre-save links, real-time stats
- **"seated"** is the emerging standard for tour/ticket integration

---

## 4. Outstanding Musician Website Examples

### Beyonce — beyonce.com

Ultra-minimalist, luxury-brand approach. Homepage is nearly empty — just a sparse top nav. No autoplay media, no hero content. Next.js custom build.

### Caroline Polachek — carolinepolachek.com

Radically minimal — entire homepage is a single SVG illustration with three nav links (STORE, VIDEO, LISTEN). Feels like a gallery installation. Next.js + styled-jsx.

### Bon Iver — boniver.org

Moody, atmospheric design matching the band's aesthetic. Dark cinematic feel, blog-style announcements, integrated Shopify store. WordPress custom theme + Shopify.

### Tame Impala — tameimpala.com

Psychedelic immersive experience. Full-width video background, bold uppercase typography, massive scrollable tour date grid. jQuery + custom HTML/CSS.

### Mitski — mitski.com

Clean, gallery-like with extreme restraint. Four-item nav (ALBUM, LIVE, MUSIC, STORE). "seated" signup widget with SMS option. WordPress custom theme.

### Beabadoobee — beabadoobee.com

Video-forward with full-bleed background video. Dreamy indie aesthetic. GSAP animations + jQuery, WordPress on UMG's Grand Royal platform.

### Sufjan Stevens — sufjan.com

Domain title: "Jar Jar Binks Fan Club" — eccentric, humorous. Uses a Tumblr blog as official presence. Intimate, personal, unmediated.

### Arctic Monkeys — arcticmonkeys.com

Section-based layout: hero image, merch carousel, video gallery, 23-year tour date archive (2003-2026 dropdown). Shopify + jQuery.

**Key patterns**: Shopify dominates commerce, WordPress dominates CMS, Next.js for avant-garde/minimal sites, custom builds produce the most distinctive results.

---

## 5. Open-Source Tools & Templates

### Audio Player Components

| Project               | Stars   | Description                                                                           |
| --------------------- | ------- | ------------------------------------------------------------------------------------- |
| wavesurfer.js         | ~9,000  | Waveform visualization + playback. THE standard. React/Vue/vanilla. MIT.              |
| Plyr                  | ~26,000 | Simple, accessible HTML5 player. Supports audio mode. Very polished.                  |
| howler.js             | ~24,000 | Cross-browser audio engine. Format fallback, Web Audio API. Essential building block. |
| AmplitudeJS           | ~2,800  | HTML5 playlist player. No dependencies, visualizations. Good for music portfolios.    |
| media-chrome          | ~2,600  | Web Components for audio/video. Built by Mux. Framework-agnostic.                     |
| react-h5-audio-player | ~1,300  | Lightweight React HTML5 player. Clean UI, mobile-friendly.                            |
| greenaudio-player     | ~700    | Minimal accessible player. ~3KB footprint.                                            |

**Recommended**: wavesurfer.js for waveform visuals, AmplitudeJS for playlist playback, howler.js as audio engine.

### SSG Template Starting Points

| Template                      | Framework | Stars         | Notes                                                 |
| ----------------------------- | --------- | ------------- | ----------------------------------------------------- |
| Astro portfolio example       | Astro     | (part of 52k) | Official example, lightweight, islands architecture   |
| Indigo                        | Jekyll    | ~2,100        | Minimal, very popular, clean layout                   |
| Tailwind Next.js Starter Blog | Next.js   | ~9,000        | Not music-specific but most popular starter           |
| Terra                         | Hugo      | ~50           | Dark mode, clean typography, good for artist showcase |

**Note**: No high-quality, actively maintained, music-specific SSG template exists with significant stars. Best approach: clean general portfolio template + dedicated audio player.

### Audio Hosting for Static Sites

| Option           | Storage Free | Egress                | Notes                                              |
| ---------------- | ------------ | --------------------- | -------------------------------------------------- |
| Internet Archive | Unlimited    | Free (non-commercial) | Direct URLs, embeddable widgets. Dated UI, no CDN. |
| Cloudflare R2    | 10 GB        | Free (no egress fees) | S3-compatible, fast global CDN. ~100-200 MP3s.     |
| Backblaze B2     | 10 GB        | $0.01/GB              | Less attractive than R2.                           |
| GitHub Pages     | 1 GB repo    | Free                  | Not suitable for audio files directly.             |

**Recommended workflow**: Cloudflare R2 (audio) + Cloudflare Pages (site) — everything on one platform, free, fast globally. Or Internet Archive for unlimited free storage.

---

## 6. Recommended Tech Stack

**Best fit for a technical Linux user who prefers open-source:**

```
Framework:   Astro (fastest builds, minimal JS, islands architecture)
Audio:       wavesurfer.js v7 (waveform visualization) + howler.js (audio engine)
Hosting:     Cloudflare Pages (site) + Cloudflare R2 (audio) — all free
CMS:         DecapCMS or TinaCMS (git-based, for easy content updates)
Calendar:    Bandsintown embed
Email:       Buttondown (free for first 100 subs)
Analytics:   Umami (self-hosted, free/open-source)
Domain:      ~$12/yr
Total cost:  $0-12/yr
Build time:  2-5 days for v1
```

**Key features to implement:**

- Sticky bottom audio bar (plays across pages)
- Track listing grouped by release, album art grid
- "Listen on Spotify/Apple Music/etc." links per track
- Bio page with press quotes
- Dark mode, responsive, minimal design
- Open Graph tags per page, MusicRecording structured data

**Alternative (less coding):** WordPress + Sonaar theme ($69 one-time) — 80% of features installed in an hour. Self-hosted on your Linux machine.

**Minimal (no coding):** Bandcamp (music/sales) + Carrd ($19/yr) as one-page portfolio linking to everything.

---

## 7. Sources & References

- Platform pricing and features: official sites (bandcamp.com, soundcloud.com, wix.com, squarespace.com) accessed May 2025
- Musician website examples: directly visited and analyzed (HTML source, tech stack identification)
- GitHub repos: search queries for music portfolio templates, audio player components
- Audio hosting: Cloudflare R2 pricing page, Internet Archive documentation
- Design trends: observed patterns across 12+ musician websites
