# samsellsit-site

The Instagram bio link page for [@samsellsit512](https://instagram.com/samsellsit512).

Two buttons, two forms. Renters and first-time buyers get routed separately,
and a completed form arrives as a pre-written text message on Sam's phone.

Single static HTML file. No build step, no framework, no dependencies.

## Live site

Hosted on Netlify. Every push to `main` deploys automatically.

## Editing your own info

Open `index.html`. The `CONFIG` block is at the very top of the file:

```js
const CONFIG = {
  PHONE:   "17372777519",
  EMAIL:   "sam@samsellsit.com",
  IG:      "samsellsit512",
  YOUTUBE: "https://www.youtube.com/@SamJosephAustinApartmentFinder"
};
```

Change those four values and nothing else. Set `YOUTUBE` to `""` to hide the
YouTube link entirely.

## Where a submission goes

1. The visitor submits. The browser POSTs to **Netlify Forms**, which stores it.
   This happens server side, so the lead is captured whether or not they do
   anything else.
2. Netlify emails **sam@samsellsit.com**.
3. `netlify/functions/submission-created.js` fires automatically and sends a
   push notification to Sam's phone via **ntfy.sh**. Tapping it dials the lead.
4. The visitor sees a confirmation screen with an optional "text me now" button
   for a faster reply.

### The ntfy topic is a secret

Anyone who knows the topic name can read every lead that comes through it.
It is stored as the `NTFY_TOPIC` environment variable in
**Netlify > Site configuration > Environment variables**, never in this repo,
because this repo is public.

To rotate it: pick a new random topic, update the env var, redeploy, and
re-subscribe in the ntfy app.

## Publishing a change

```bash
./push.sh "what you changed"
```

Netlify picks it up and the live site updates in about 30 seconds.

## Useful links

| Path | Goes to |
|---|---|
| `/` | the two-button chooser |
| `/rent` | straight to the renter form |
| `/buy` | straight to the buyer form |

Use `/buy` in the bio the week a video is about buying, so nobody has to choose twice.

## Design

Built on the Mid-Century Austin Financial Editorial system.
Cream `#F3E9D2`, navy `#0C325F`, antique gold `#B88A2B`.
League Gothic display, Barlow Condensed headings, Source Sans 3 body.
