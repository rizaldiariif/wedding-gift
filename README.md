# Wedding Gift Website

A single-page wedding gift registry for friends and family to browse gifts and
reserve them. No build step, no dependencies — plain HTML, CSS, and JavaScript.

## Preview locally

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

Or simply open `index.html` in a browser.

## Customize

Everything lives in **`js/data.js`**:

| What | Where |
| --- | --- |
| Couple names, monogram | `CONFIG.couple` |
| Wedding date, akad, resepsi, venue | `CONFIG.wedding` |
| Registry intro paragraph | `CONFIG.text.introText` |
| WhatsApp number (`62812...` format) | `CONFIG.contact.whatsapp` |
| Gift list | `GIFTS` |
| Category tabs | `CATEGORIES` |
| Registered guest names (personalized links) | `GUESTS` |

### Adding a gift

```js
{
  id: "unique-id",
  title: "Nama Hadiah",
  desc: "Deskripsi singkat.",
  price: 1500000,            // or null + priceLabel for "Nominal bebas"
  category: "dapur",         // dapur | rumah | elektronik | lainnya
  icon: "mixer",             // key from ICONS in js/data.js
  qty: 1,                    // shown as "Butuh N" when > 1
  featured: true,            // shows the "Paling Dibutuhkan" badge
  link: "https://shopee.co.id/..." // empty string hides the "Beli" button
}
```

To use real product photos instead of icons, add an `image` field with a path or
URL (e.g. `image: "images/stand-mixer.jpg"`). The card and modal will render the
photo automatically.

### Guest links

Guests can get a personalized link such as `https://your-site.com/?name=Anya+Belliza`.
Names must be listed in `GUESTS` (case-insensitive; extra spaces are ignored):

- Registered name → the page opens, greets the guest ("Kepada Yth. ..."), and they can mark gifts
- Unknown name → the page shows an "invalid link" notice instead of the registry
- No `name` parameter → the page opens normally, but the check/mark buttons are hidden

Spaces can be written as `+` or `%20` in the URL.

## Features

- Personalized guest links via `?name=` validated against the `GUESTS` list
- Registry-first layout: the page opens straight on the gift list, no landing page
- Gift list with search, category filters, and sorting
- Gift detail modal with a WhatsApp confirmation link and the shop link
- "Already gifted" marker synced globally (Upstash Redis) and saved with the registered guest's name
- Countdown to the wedding day
- "Save the date" `.ics` download and share button
- Responsive, keyboard-accessible, reduced-motion friendly

## Notes

- Claims are stored globally in Upstash Redis through `api/claims.js`. Each claim
  records the registered guest name from `?name=` that marked the gift, and only
  that same name can release it. On Vercel, install the Upstash Redis integration
  (Storage → Marketplace) and the env vars (`KV_REST_API_URL` / `KV_REST_API_TOKEN`)
  are set automatically; `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` also work.
- When the API is not reachable (opening `index.html` directly, plain
  `python3 -m http.server`, or a host without serverless functions), the site
  falls back to per-device `localStorage` so it still works.
- To run the API locally, use `npx vercel dev` (after `npx vercel env pull`).
- Everything else is static, so the site still deploys anywhere.
