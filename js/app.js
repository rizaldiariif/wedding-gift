(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(sel));

  const CLAIMS_KEY = "wg:claims:v1";

  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (err) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        /* storage unavailable */
      }
    }
  };

  let claims = store.get(CLAIMS_KEY, {});
  const state = { query: "", category: "semua", sort: "featured" };

  function svgIcon(name) {
    const body = ICONS[name] || "";
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + "</svg>";
  }

  function hydrateIcons(root) {
    $$("[data-icon]", root || document).forEach(function (el) {
      if (el.dataset.iconReady) return;
      el.innerHTML = svgIcon(el.dataset.icon);
      el.dataset.iconReady = "1";
    });
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function fmtIDR(value) {
    if (value == null) return "—";
    return "Rp " + new Intl.NumberFormat("id-ID").format(value);
  }

  function priceLabel(gift) {
    if (gift.priceLabel) return gift.priceLabel;
    if (gift.price == null) return "Nominal bebas";
    return fmtIDR(gift.price);
  }

  function waLink(message) {
    return "https://wa.me/" + CONFIG.contact.whatsapp + "?text=" + encodeURIComponent(message);
  }

  function categoryLabel(id) {
    const found = CATEGORIES.filter(function (c) { return c.id === id; })[0];
    return found ? found.label : id;
  }

  let toastTimer = null;
  function toast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2600);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (err) {
        reject(err);
      }
      document.body.removeChild(area);
    });
  }

  function applyStaticText() {
    const map = {
      monogram: CONFIG.couple.monogram,
      shortNames: CONFIG.couple.shortNames,
      names: CONFIG.couple.names,
      dateLabel: CONFIG.wedding.dateLabel,
      city: CONFIG.wedding.city,
      introText: CONFIG.text.introText
    };
    Object.keys(map).forEach(function (key) {
      $$('[data-text="' + key + '"]').forEach(function (el) { el.textContent = map[key]; });
    });
    document.title = "Wedding Gift — " + CONFIG.couple.names;
    $("#nav-wa").href = waLink(
      "Halo " + CONFIG.couple.shortNames + ", saya ingin bertanya mengenai daftar hadiah pernikahan kalian."
    );
  }

  function renderChips() {
    const counts = { semua: GIFTS.length };
    GIFTS.forEach(function (g) { counts[g.category] = (counts[g.category] || 0) + 1; });
    $("#chips").innerHTML = CATEGORIES.map(function (cat) {
      const active = state.category === cat.id ? " is-active" : "";
      return '<button type="button" class="chip' + active + '" data-category="' + cat.id + '" role="tab" aria-selected="' + (active ? "true" : "false") + '">' +
        esc(cat.label) + " <span>· " + (counts[cat.id] || 0) + "</span></button>";
    }).join("");
  }

  function visibleGifts() {
    const q = state.query.trim().toLowerCase();
    let list = GIFTS.filter(function (g) {
      const matchCat = state.category === "semua" || g.category === state.category;
      const haystack = (g.title + " " + g.desc + " " + categoryLabel(g.category)).toLowerCase();
      return matchCat && (!q || haystack.indexOf(q) !== -1);
    });
    if (state.sort === "price-asc") {
      list = list.slice().sort(function (a, b) { return (a.price == null ? Infinity : a.price) - (b.price == null ? Infinity : b.price); });
    } else if (state.sort === "price-desc") {
      list = list.slice().sort(function (a, b) { return (b.price == null ? -1 : b.price) - (a.price == null ? -1 : a.price); });
    } else if (state.sort === "name") {
      list = list.slice().sort(function (a, b) { return a.title.localeCompare(b.title, "id"); });
    } else {
      list = list.slice().sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });
    }
    return list;
  }

  function giftCard(gift, index) {
    const claimed = !!claims[gift.id];
    const media = gift.image
      ? '<img src="' + esc(gift.image) + '" alt="' + esc(gift.title) + '" loading="lazy">'
      : '<span class="gift-icon" data-icon="' + gift.icon + '"></span>';
    const buyAction = gift.link
      ? '<a class="btn btn-sm btn-primary" href="' + esc(gift.link) + '" target="_blank" rel="noopener">Beli</a>'
      : '<button type="button" class="btn btn-sm btn-primary" data-open="' + gift.id + '">Beri</button>';
    return (
      '<article class="gift' + (claimed ? " is-claimed" : "") + '" data-id="' + gift.id + '" style="animation:rise .5s var(--ease) both;animation-delay:' + index * 45 + 'ms">' +
        '<div class="gift-media cat-' + gift.category + '">' +
          media +
          (gift.featured ? '<span class="gift-badge">Paling Dibutuhkan</span>' : "") +
          '<span class="gift-ribbon"><span class="icon" data-icon="check"></span> Sudah dibeli</span>' +
        "</div>" +
        '<div class="gift-body">' +
          '<p class="gift-cat">' + esc(categoryLabel(gift.category)) + "</p>" +
          '<h3 class="gift-title">' + esc(gift.title) + "</h3>" +
          '<p class="gift-desc">' + esc(gift.desc) + "</p>" +
          '<div class="gift-meta">' +
            '<span class="gift-price">' + esc(priceLabel(gift)) + "</span>" +
            (gift.qty > 1 ? '<span class="gift-qty">Butuh ' + gift.qty + "</span>" : "") +
          "</div>" +
          '<div class="gift-actions">' +
            '<button type="button" class="btn btn-sm btn-ghost" data-open="' + gift.id + '">Detail</button>' +
            buyAction +
            '<button type="button" class="claim-btn' + (claimed ? " is-on" : "") + '" data-claim="' + gift.id + '" title="' + (claimed ? "Batalkan tanda sudah dibeli" : "Tandai sudah dibeli") + '" aria-label="' + (claimed ? "Batalkan tanda sudah dibeli" : "Tandai sudah dibeli") + '">' +
              '<span class="icon" data-icon="check"></span>' +
            "</button>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function renderGifts() {
    const list = visibleGifts();
    const grid = $("#gift-grid");
    grid.innerHTML = list.map(giftCard).join("");
    $("#gift-empty").hidden = list.length > 0;
    $("#gift-count").textContent = "Menampilkan " + list.length + " dari " + GIFTS.length + " hadiah";
    hydrateIcons(grid);
  }

  function openModal(gift) {
    const claimed = !!claims[gift.id];
    const media = gift.image
      ? '<img src="' + esc(gift.image) + '" alt="' + esc(gift.title) + '">'
      : '<span class="gift-icon" data-icon="' + gift.icon + '"></span>';
    const facts =
      '<div class="modal-facts">' +
        '<div class="fact"><span>Kategori</span><strong>' + esc(categoryLabel(gift.category)) + "</strong></div>" +
        '<div class="fact"><span>Perkiraan Harga</span><strong>' + esc(priceLabel(gift)) + "</strong></div>" +
        (gift.qty > 1 ? '<div class="fact"><span>Dibutuhkan</span><strong>' + gift.qty + " buah</strong></div>" : "") +
        '<div class="fact"><span>Status</span><strong>' + (claimed ? "Sudah dibeli" : "Belum dibeli") + "</strong></div>" +
      "</div>";

    const waMsg = "Halo " + CONFIG.couple.shortNames + ", saya ingin memberikan hadiah *" + gift.title + "* (" + priceLabel(gift) + ") untuk pernikahan kalian. Apakah masih dibutuhkan? Terima kasih!";

    const actions =
      '<div class="modal-actions">' +
        (gift.link
          ? '<a class="btn btn-primary" href="' + esc(gift.link) + '" target="_blank" rel="noopener"><span class="icon" data-icon="external"></span> Beli Sekarang</a>'
          : '<a class="btn btn-primary" href="' + waLink(waMsg) + '" target="_blank" rel="noopener"><span class="icon" data-icon="chat"></span> Tanya via WhatsApp</a>') +
        '<a class="btn btn-gold" href="' + waLink(waMsg) + '" target="_blank" rel="noopener"><span class="icon" data-icon="chat"></span> Konfirmasi via WA</a>' +
        '<button type="button" class="btn btn-outline wide" data-claim="' + gift.id + '"><span class="icon" data-icon="check"></span> ' + (claimed ? "Batalkan tanda sudah dibeli" : "Tandai sudah dibeli") + "</button>" +
      "</div>";

    $("#modal-body").innerHTML =
      '<div class="modal-media cat-' + gift.category + '">' + media + "</div>" +
      '<div class="modal-content">' +
        '<p class="gift-cat">' + esc(categoryLabel(gift.category)) + "</p>" +
        '<h3 id="modal-title">' + esc(gift.title) + "</h3>" +
        '<p class="desc">' + esc(gift.desc) + "</p>" +
        facts +
        '<p class="modal-note">Tanda “sudah dibeli” tersimpan di perangkat ini. Mohon konfirmasi via WhatsApp agar tidak dobel.</p>' +
        actions +
      "</div>";

    const modal = $("#modal");
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    hydrateIcons(modal);
    $(".modal-close").focus();
  }

  function closeModal() {
    $("#modal").hidden = true;
    document.body.classList.remove("no-scroll");
  }

  function giftById(id) {
    return GIFTS.filter(function (g) { return g.id === id; })[0];
  }

  function toggleClaim(id) {
    if (claims[id]) {
      delete claims[id];
    } else {
      claims[id] = true;
    }
    store.set(CLAIMS_KEY, claims);
    renderGifts();
    if (!$("#modal").hidden) {
      const gift = giftById(id);
      if (gift) openModal(gift);
    }
    const gift = giftById(id);
    toast(claims[id] ? "Ditandai: " + gift.title : "Tanda dihapus: " + gift.title);
  }

  function countdown() {
    const target = new Date(CONFIG.wedding.dateISO).getTime();
    const box = $("#countdown");
    if (isNaN(target)) return;
    let timer = null;

    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        box.innerHTML = '<div class="cd-item" style="min-width:auto;padding:1rem 1.6rem"><strong style="font-size:1.2rem">Alhamdulillah</strong><span>Kami telah menikah</span></div>';
        clearInterval(timer);
        return;
      }
      const parts = {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      };
      Object.keys(parts).forEach(function (unit) {
        const el = $('[data-unit="' + unit + '"]', box);
        if (el) el.textContent = String(parts[unit]).padStart(2, "0");
      });
    }

    tick();
    timer = setInterval(tick, 1000);
  }

  function saveDate() {
    const start = new Date(CONFIG.wedding.dateISO);
    const end = new Date(start.getTime() + 4 * 3600000);
    const stamp = function (date) {
      return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    };
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedding Gift//ID",
      "BEGIN:VEVENT",
      "UID:" + Date.now() + "@wedding-gift",
      "DTSTAMP:" + stamp(new Date()),
      "DTSTART:" + stamp(start),
      "DTEND:" + stamp(end),
      "SUMMARY:Pernikahan " + CONFIG.couple.shortNames,
      "LOCATION:" + CONFIG.wedding.venue.replace(/,/g, "\\,"),
      "DESCRIPTION:Akad " + CONFIG.wedding.akad + " · Resepsi " + CONFIG.wedding.resepsi,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pernikahan-" + CONFIG.couple.shortNames.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast("Tanggal disimpan ke kalender Anda");
  }

  function sharePage() {
    const data = {
      title: "Wedding Gift — " + CONFIG.couple.shortNames,
      text: "Daftar hadiah pernikahan " + CONFIG.couple.shortNames,
      url: window.location.href
    };
    if (navigator.share) {
      navigator.share(data).catch(function () {});
      return;
    }
    copyText(window.location.href).then(function () {
      toast("Tautan halaman disalin");
    }).catch(function () {
      toast("Salin manual: " + window.location.href);
    });
  }

  function initNav() {
    const nav = $("#site-nav");
    function onScroll() {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initReveal() {
    const items = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { observer.observe(el); });
  }

  function deepLink() {
    let params;
    try {
      params = new URLSearchParams(window.location.search);
    } catch (err) {
      return;
    }
    const cat = params.get("cat");
    if (cat && CATEGORIES.some(function (c) { return c.id === cat; })) {
      state.category = cat;
      renderChips();
      renderGifts();
    }
    const giftId = params.get("gift");
    if (giftId) {
      const gift = giftById(giftId);
      if (gift) openModal(gift);
    }
  }

  function initEvents() {
    $("#chips").addEventListener("click", function (event) {
      const chip = event.target.closest("[data-category]");
      if (!chip) return;
      state.category = chip.dataset.category;
      renderChips();
      renderGifts();
    });

    $("#search").addEventListener("input", function (event) {
      state.query = event.target.value;
      renderGifts();
    });

    $("#sort").addEventListener("change", function (event) {
      state.sort = event.target.value;
      renderGifts();
    });

    document.addEventListener("click", function (event) {
      const openBtn = event.target.closest("[data-open]");
      if (openBtn) {
        const gift = giftById(openBtn.dataset.open);
        if (gift) openModal(gift);
        return;
      }

      const claimBtn = event.target.closest("[data-claim]");
      if (claimBtn) {
        toggleClaim(claimBtn.dataset.claim);
        return;
      }

      if (event.target.closest("[data-close]")) closeModal();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !$("#modal").hidden) closeModal();
    });

    $("#save-date").addEventListener("click", saveDate);
    $("#share-page").addEventListener("click", sharePage);
  }

  function init() {
    applyStaticText();
    renderChips();
    renderGifts();
    countdown();
    initNav();
    initReveal();
    initEvents();
    hydrateIcons(document);
    deepLink();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
