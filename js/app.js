(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(sel));

  const CLAIMS_KEY = "wg:claims:v1";
  const CLAIMS_API = "api/claims";

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

  let claims = {};
  let claimsMode = "local";
  let guestName = null;
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

  function fetchRemoteClaims() {
    if (typeof fetch !== "function") return Promise.reject(new Error("fetch unavailable"));
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 4000) : null;
    return fetch(CLAIMS_API, { headers: { Accept: "application/json" }, signal: ctrl ? ctrl.signal : undefined })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (timer) clearTimeout(timer);
        return data && data.claims ? data.claims : {};
      });
  }

  function loadClaims() {
    return fetchRemoteClaims().then(function (remote) {
      claimsMode = "remote";
      claims = remote;
    }).catch(function () {
      claimsMode = "local";
      claims = store.get(CLAIMS_KEY, {});
    });
  }

  function postClaim(id, action, name) {
    return fetch(CLAIMS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ id: id, action: action, name: name })
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        return { ok: res.ok, status: res.status, claims: data.claims || null, error: data.error || "" };
      });
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
    document.title = "Daftar Hadiah Pernikahan " + CONFIG.couple.names;
    $("#nav-wa").href = waLink(
      "Halo " + CONFIG.couple.shortNames + ", saya ingin bertanya mengenai daftar hadiah pernikahan kalian."
    );
  }

  function normalizeName(value) {
    return String(value == null ? "" : value).replace(/\s+/g, " ").trim().toLowerCase();
  }

  function guestFromURL() {
    let name = null;
    try {
      name = new URLSearchParams(window.location.search).get("name");
    } catch (err) {
      return { allowed: true, guest: null };
    }
    const key = normalizeName(name);
    if (!key) return { allowed: true, guest: null };
    const list = typeof GUESTS === "undefined" ? [] : GUESTS;
    const guest = list.filter(function (g) { return normalizeName(g) === key; })[0];
    return guest ? { allowed: true, guest: guest } : { allowed: false, guest: null };
  }

  function showDenied() {
    document.title = "Tautan tidak berlaku — Wedding Gift";
    const denied = $("#access-denied");
    denied.hidden = false;
    document.body.classList.add("no-scroll");
    hydrateIcons(denied);
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
    const claimant = typeof claims[gift.id] === "string" ? claims[gift.id] : "";
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
          '<span class="gift-ribbon"' + (claimant ? ' title="Ditandai oleh ' + esc(claimant) + '"' : "") + '><span class="icon" data-icon="check"></span> Sudah dibeli</span>' +
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
            (guestName
              ? '<button type="button" class="claim-btn' + (claimed ? " is-on" : "") + '" data-claim="' + gift.id + '" title="' + (claimed ? "Batalkan tanda sudah dibeli" : "Tandai sudah dibeli") + '" aria-label="' + (claimed ? "Batalkan tanda sudah dibeli" : "Tandai sudah dibeli") + '">' +
                  '<span class="icon" data-icon="check"></span>' +
                "</button>"
              : "") +
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
    const claimant = typeof claims[gift.id] === "string" ? claims[gift.id] : "";
    const mine = !claimant || (!!guestName && normalizeName(claimant) === normalizeName(guestName));
    const media = gift.image
      ? '<img src="' + esc(gift.image) + '" alt="' + esc(gift.title) + '">'
      : '<span class="gift-icon" data-icon="' + gift.icon + '"></span>';
    const facts =
      '<div class="modal-facts">' +
        '<div class="fact"><span>Kategori</span><strong>' + esc(categoryLabel(gift.category)) + "</strong></div>" +
        '<div class="fact"><span>Perkiraan Harga</span><strong>' + esc(priceLabel(gift)) + "</strong></div>" +
        (gift.qty > 1 ? '<div class="fact"><span>Dibutuhkan</span><strong>' + gift.qty + " buah</strong></div>" : "") +
        '<div class="fact"><span>Status</span><strong>' + (claimed ? (claimant ? "Sudah dibeli oleh " + esc(claimant) : "Sudah dibeli") : "Belum dibeli") + "</strong></div>" +
      "</div>";

    const waMsg = "Halo " + CONFIG.couple.shortNames + ", saya ingin memberikan hadiah *" + gift.title + "* (" + priceLabel(gift) + ") untuk pernikahan kalian. Apakah masih dibutuhkan? Terima kasih!";

    const actions =
      '<div class="modal-actions">' +
        (gift.link
          ? '<a class="btn btn-primary" href="' + esc(gift.link) + '" target="_blank" rel="noopener"><span class="icon" data-icon="external"></span> Beli Sekarang</a>'
          : '<a class="btn btn-primary" href="' + waLink(waMsg) + '" target="_blank" rel="noopener"><span class="icon" data-icon="chat"></span> Tanya via WhatsApp</a>') +
        '<a class="btn btn-gold" href="' + waLink(waMsg) + '" target="_blank" rel="noopener"><span class="icon" data-icon="chat"></span> Konfirmasi via WA</a>' +
        (guestName
          ? (claimed && !mine
              ? '<button type="button" class="btn btn-outline wide" data-claim="' + gift.id + '"><span class="icon" data-icon="check"></span> Ditandai oleh ' + esc(claimant) + "</button>"
              : '<button type="button" class="btn btn-outline wide" data-claim="' + gift.id + '"><span class="icon" data-icon="check"></span> ' + (claimed ? "Batalkan tanda sudah dibeli" : "Tandai sudah dibeli") + "</button>")
          : "") +
      "</div>";

    $("#modal-body").innerHTML =
      '<div class="modal-media cat-' + gift.category + '">' + media + "</div>" +
      '<div class="modal-content">' +
        '<p class="gift-cat">' + esc(categoryLabel(gift.category)) + "</p>" +
        '<h3 id="modal-title">' + esc(gift.title) + "</h3>" +
        '<p class="desc">' + esc(gift.desc) + "</p>" +
        facts +
        '<p class="modal-note">Tanda “sudah dibeli” tersimpan bersama nama tamu yang menandainya. Mohon konfirmasi via WhatsApp agar tidak dobel.</p>' +
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

  function settleClaim(id, nextClaims) {
    if (nextClaims) claims = nextClaims;
    renderGifts();
    if (!$("#modal").hidden) {
      const gift = giftById(id);
      if (gift) openModal(gift);
    }
  }

  function toggleClaim(id) {
    const gift = giftById(id);
    const current = claims[id];
    const currentName = typeof current === "string" ? current : "";

    if (claimsMode === "local") {
      if (current) delete claims[id]; else claims[id] = true;
      store.set(CLAIMS_KEY, claims);
      settleClaim(id);
      toast(current ? "Tanda dihapus: " + gift.title : "Ditandai: " + gift.title);
      return;
    }

    if (!guestName) {
      toast("Buka tautan pribadi Anda untuk menandai hadiah");
      return;
    }

    if (currentName && normalizeName(currentName) !== normalizeName(guestName)) {
      toast("Sudah ditandai oleh " + currentName);
      return;
    }

    const action = current ? "release" : "claim";
    const doneMessage = action === "release" ? "Tanda dihapus: " + gift.title : "Ditandai: " + gift.title;

    if (action === "release") delete claims[id]; else claims[id] = guestName;
    renderGifts();

    postClaim(id, action, guestName).then(function (result) {
      if (result.status === 409) {
        settleClaim(id, result.claims);
        toast("Hadiah ini baru saja ditandai tamu lain");
        return;
      }
      if (result.status === 403) {
        settleClaim(id, result.claims);
        toast(result.error === "not_your_claim" ? "Sudah ditandai oleh tamu lain" : "Nama Anda tidak terdaftar");
        return;
      }
      if (!result.ok) throw new Error("HTTP " + result.status);
      settleClaim(id, result.claims);
      toast(doneMessage);
    }).catch(function () {
      if (action === "release") claims[id] = current; else delete claims[id];
      renderGifts();
      toast("Gagal menyimpan, coba lagi");
    });
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

    const access = guestFromURL();
    if (!access.allowed) {
      showDenied();
      return;
    }
    if (access.guest) {
      guestName = access.guest;
      $("#guest-greeting strong").textContent = access.guest;
      $("#guest-greeting").hidden = false;
    }

    loadClaims().then(function () {
      renderChips();
      renderGifts();
      countdown();
      initNav();
      initReveal();
      initEvents();
      hydrateIcons(document);
      deepLink();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
