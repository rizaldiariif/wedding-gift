(function () {
  "use strict";

  const $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  const CLAIMS_API = "api/claims";
  const CLAIMS_KEY = "wg:claims:v1";

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

  function categoryLabel(id) {
    const found = CATEGORIES.filter(function (c) { return c.id === id; })[0];
    return found ? found.label : id;
  }

  function claimant(claims, id) {
    const value = claims[id];
    if (!value) return "";
    return typeof value === "string" ? value : "";
  }

  function badge(claimed, name) {
    if (!claimed) return '<span class="status-badge is-open">Belum ditandai</span>';
    return '<span class="status-badge is-claimed">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12l5 5L20 6"/></svg>' +
      '<span class="guest">' + esc(name || "Ditandai") + "</span>" +
      "</span>";
  }

  function render(claims, note) {
    const claimedFirst = GIFTS.slice().sort(function (a, b) {
      const ca = !!claims[a.id];
      const cb = !!claims[b.id];
      if (ca !== cb) return ca ? -1 : 1;
      return 0;
    });

    let claimedCount = 0;
    $("#status-list").innerHTML = claimedFirst.map(function (gift) {
      const claimed = !!claims[gift.id];
      const name = claimant(claims, gift.id);
      if (claimed) claimedCount++;
      const title = gift.link
        ? '<a href="' + esc(gift.link) + '" target="_blank" rel="noopener">' + esc(gift.title) + "</a>"
        : esc(gift.title);
      return (
        '<article class="status-row' + (claimed ? " is-claimed" : "") + '">' +
          '<div class="status-info">' +
            '<span class="status-cat">' + esc(categoryLabel(gift.category)) + "</span>" +
            '<h3 class="status-name">' + title + "</h3>" +
            '<span class="status-price">' + esc(priceLabel(gift)) + "</span>" +
          "</div>" +
          badge(claimed, name) +
        "</article>"
      );
    }).join("");

    $("#stat-claimed").textContent = String(claimedCount);
    $("#stat-open").textContent = String(GIFTS.length - claimedCount);
    $("#stat-total").textContent = String(GIFTS.length);

    const time = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta"
    });
    $("#updated").textContent = time + " WIB" + (note ? " · " + note : "");
  }

  function fetchClaims() {
    if (typeof fetch !== "function") return Promise.reject(new Error("fetch unavailable"));
    return fetch(CLAIMS_API + "?t=" + Date.now(), { headers: { Accept: "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        return data && data.claims ? data.claims : {};
      });
  }

  function load() {
    const error = $("#status-error");
    error.hidden = true;
    $("#updated").textContent = "memuat…";
    fetchClaims().then(function (claims) {
      render(claims, "");
    }).catch(function () {
      let local = {};
      try {
        local = JSON.parse(localStorage.getItem(CLAIMS_KEY) || "{}");
      } catch (err) {
        local = {};
      }
      render(local, "mode lokal");
      error.hidden = false;
      error.textContent = "Data global tidak bisa dimuat saat ini. Menampilkan tanda yang tersimpan di perangkat ini.";
    });
  }

  const textMap = {
    shortNames: CONFIG.couple.shortNames,
    names: CONFIG.couple.names
  };
  Object.keys(textMap).forEach(function (key) {
    Array.prototype.slice.call(document.querySelectorAll('[data-text="' + key + '"]')).forEach(function (el) {
      el.textContent = textMap[key];
    });
  });
  document.title = "Status Hadiah — " + CONFIG.couple.shortNames;

  $("#refresh").addEventListener("click", load);
  load();
})();
