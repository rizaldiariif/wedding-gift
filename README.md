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

- Registry-first layout: the page opens straight on the gift list, no landing page
- Gift list with search, category filters, and sorting
- Gift detail modal with a WhatsApp confirmation link and the shop link
- "Already gifted" marker persisted in `localStorage`
- Countdown to the wedding day
- "Save the date" `.ics` download and share button
- Responsive, keyboard-accessible, reduced-motion friendly

## Notes

- Claims are stored per-device in `localStorage`. For shared state across all
  guests, connect a backend (Supabase, Firebase, Google Sheets API) to the
  `CLAIMS_KEY` logic in `js/app.js`.
- Because the site is static, deploy it anywhere: Vercel, GitHub Pages, Netlify,
  Cloudflare Pages, or any web host. Just upload the folder.
