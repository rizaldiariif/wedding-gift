# Wedding Gift Website

A single-page wedding gift registry for friends and family to browse gifts, claim
them, and send cash gifts. No build step, no dependencies — plain HTML, CSS, and
JavaScript.

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
| Hero and intro paragraphs | `CONFIG.text` |
| WhatsApp number (`62812...` format) | `CONFIG.contact.whatsapp` |
| Shipping address | `CONFIG.shipping` |
| Bank accounts | `CONFIG.banks` |
| E-wallets / QRIS toggle | `CONFIG.ewallets`, `CONFIG.qrisAvailable` |
| Gift list | `GIFTS` |
| Category tabs | `CATEGORIES` |
| Seed messages on the wishes wall | `SEED_WISHES` |

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

## Features

- Countdown to the wedding day
- Gift registry with search, category filters, and sorting
- Gift detail modal with WhatsApp confirmation and shop link
- "Already gifted" marker persisted in `localStorage`
- Shipping address, bank accounts, and e-wallets with one-tap copy
- Wishes wall with a form (saved in `localStorage`, no server)
- "Save the date" `.ics` download and share button
- Responsive, keyboard-accessible, reduced-motion friendly

## Notes

- Claims and wishes are stored per-device in `localStorage`. For shared state
  across all guests, connect a backend (Supabase, Firebase, Google Sheets API)
  to the `CLAIMS_KEY` / `WISHES_KEY` logic in `js/app.js`.
- Because the site is static, deploy it anywhere: GitHub Pages, Netlify, Vercel,
  Cloudflare Pages, or any web host. Just upload the folder.

## Deploy to GitHub Pages

```bash
git init && git add . && git commit -m "Wedding gift website"
git remote add origin git@github.com:<user>/<repo>.git
git push -u origin main
```

Then enable Pages for the repository (Settings → Pages → Deploy from branch →
`main` / root).
