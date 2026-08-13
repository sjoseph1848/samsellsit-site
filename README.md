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
