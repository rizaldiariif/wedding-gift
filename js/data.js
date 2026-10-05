/* ============================================================
   SEMUA KONTEN WEBSITE DIATUR DI FILE INI.
   Ubah nama, tanggal, hadiah, rekening, dan nomor WhatsApp
   sesuai kebutuhan. Tidak perlu menyentuh file lain.
   ============================================================ */

const CONFIG = {
  couple: {
    groom: "Aldi",
    bride: "Defa",
    monogram: "D & A",
    shortNames: "Defa & Aldi",
    names: "Defa & Aldi"
  },

  wedding: {
    dateISO: "2026-10-11T09:00:00+07:00",
    dateLabel: "Minggu, 11 Oktober 2026",
    city: "Jakarta",
    akad: "09.00 WIB",
    resepsi: "11.00 – 14.00 WIB",
    venue: "Ballroom Hotel Nusantara, Jl. Jenderal Sudirman Kav. 10, Jakarta Pusat"
  },

  text: {
    introText:
      "Bagi keluarga dan kerabat yang ingin memberikan tanda kasih, kami telah mengumpulkan beberapa opsi kebutuhan di sini. Terima kasih tulus atas doa dan perhatian yang diberikan."
  },

  contact: {
    whatsapp: "6281319794593",
    phoneLabel: "+62 813-1979-4593"
  }
};

/* Daftar nama tamu yang mendapat akses lewat tautan personal (?name=...).
   Nama tidak membedakan huruf besar/kecil dan spasi berlebih.
   Tambahkan nama tamu lain di dalam array ini. */
const GUESTS = [
  "smgeng",
  "exvoila",
  "makanmakan",
  "hamba allah",
  "orang baik"
];

const CATEGORIES = [
  { id: "semua", label: "Semua" },
  { id: "dapur", label: "Dapur & Masak" },
  { id: "rumah", label: "Rumah Tangga" },
  { id: "elektronik", label: "Elektronik" },
  { id: "lainnya", label: "Bulan Madu & Lainnya" }
];

const ICONS = {
  mixer: '<path d="M3 14h18a9 9 0 0 1-18 0z"/><path d="M12 14V5a2 2 0 0 1 4 0"/><path d="M12 9v5"/>',
  airfryer: '<rect x="5" y="3" width="14" height="18" rx="3"/><path d="M9 8h6v5H9z"/><path d="M12 13v3"/><path d="M12 19h.01"/>',
  blender: '<path d="M8 3h8l-1 10H9L8 3z"/><path d="M7 13h10v5a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-5z"/><path d="M12 6v4"/>',
  ricecooker: '<path d="M4 10h16"/><path d="M6 10v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8"/><path d="M9 6h6v4H9z"/><path d="M12 3v3"/>',
  knife: '<path d="M7 3v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2V3"/><path d="M9 12v9"/><path d="M16 3c-1.5 1.5-2 3.5-2 5.5 0 1.5.7 2.5 2 3V21"/>',
  plate: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/>',
  coffee: '<path d="M5 4h9v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V4z"/><path d="M14 6h3a2 2 0 0 1 0 4h-3"/><path d="M5 20h12"/>',
  kettle: '<path d="M8 9h8v7a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3V9z"/><path d="M16 11l4-1"/><path d="M9 6h6"/><path d="M8 12H6a2 2 0 0 0 0 4h2"/>',
  vacuum: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v2"/>',
  towel: '<rect x="4" y="6" width="16" height="4" rx="1"/><rect x="4" y="10" width="16" height="4" rx="1"/><rect x="4" y="14" width="16" height="4" rx="1"/>',
  bed: '<path d="M3 20v-9a1 1 0 0 1 1-1h13a4 4 0 0 1 4 4v6"/><path d="M3 20h18"/><path d="M6 10V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>',
  iron: '<path d="M4 17h11a5 5 0 0 0 5-5v-1H8a4 4 0 0 0-4 4v2z"/><path d="M9 11V9a2 2 0 0 1 2-2h5"/><path d="M4 20h16"/>',
  dispenser: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M9 7h6"/><path d="M9 12h6"/><path d="M10 16h4"/>',
  lamp: '<path d="M12 3v2"/><path d="M6 14l3-9h6l3 9H6z"/><path d="M12 14v6"/><path d="M8 21h8"/>',
  tv: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
  camera: '<path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',
  speaker: '<rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="8" r="2"/><circle cx="12" cy="16" r="3"/>',
  luggage: '<rect x="5" y="8" width="14" height="12" rx="2"/><path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M9 20v2"/><path d="M15 20v2"/>',
  plane: '<path d="M21 3L3 11l7 2 2 7 9-17z"/><path d="M21 3l-11 10"/>',
  wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><circle cx="16" cy="14.5" r="1"/>',
  gift: '<rect x="4" y="10" width="16" height="10" rx="1.5"/><path d="M3 7h18v3H3z"/><path d="M12 7v13"/><path d="M12 7c-3.5 0-5-1.2-5-2.5C7 3 9.5 3 10.5 4S12 6.5 12 7z"/><path d="M12 7c3.5 0 5-1.2 5-2.5C17 3 14.5 3 13.5 4S12 6.5 12 7z"/>',
  heart: '<path d="M12 20s-7-4.6-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.4-9 9-9 9z"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 3v4"/><path d="M16 3v4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M12 21s-7-5.3-7-11a7 7 0 0 1 14 0c0 5.7-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
  chat: '<path d="M21 12a8 8 0 0 1-8 8H4l1.5-3A8 8 0 1 1 21 12z"/><path d="M8.5 11h.01"/><path d="M12 11h.01"/><path d="M15.5 11h.01"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  check: '<path d="M4 12l5 5L20 6"/>',
  close: '<path d="M6 6l12 12"/><path d="M18 6L6 18"/>',
  "chevron-down": '<path d="M6 9l6 6 6-6"/>',
  external: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/>',
  fan: '<path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z"/><path d="M12 12v.01"/>',
  send: '<path d="M21 3L3 11l7 2 2 7 9-17z"/><path d="M21 3l-11 10"/>'
};

const GIFTS = [
  {
    id: "air-purifier",
    title: "MISS LIFE Air Purifier K1 Max",
    desc: "Pembersih udara HEPA + UV dengan ion negatif, hemat listrik untuk kamar dan ruang keluarga.",
    price: 774900,
    category: "rumah",
    icon: "vacuum",
    image: "images/air-purifier.jpg",
    qty: 1,
    link: "https://www.tokopedia.com/misslifeindonesia-848/miss-life-air-purifier-pembersih-udara-ruangan-terbaik-dengan-hepa-filter-anti-bakteri-sterilisasi-dengan-sinar-uv-hemat-listrik-dan-ion-negatif-mengatasi-debu-bau-alergen-dan-bau-aneh-dan-bulu-hewan-peliharaan-one-home-air-purifier-1729935472290924893-1737577933734053213"
  },
  {
    id: "handheld-fan",
    title: "Aerlia Handheld Fan Mist 5000mAh",
    desc: "Kipas angin portabel dengan spray mist dan layar LED, baterai 5000mAh. Paket Buy 1 Get 1.",
    price: 270999,
    category: "elektronik",
    icon: "fan",
    image: "images/handheld-fan.jpg",
    qty: 1,
    link: "https://www.tokopedia.com/aerlia-indonesia/buy-1-get-1-baterai-berkapasitas-besar-5000mah-aerlia-handheld-fan-mist-high-speed-handheld-spray-fan-kipas-angin-portable-with-led-display-5000mah-50mltank-capacity-100-air-speeds-spray-mode-hydrate-moisturizing-1737018283860068004-1737018334044260004"
  },
  {
    id: "steamer-philips",
    title: "Philips Handheld Steamer STH5030",
    desc: "Setrika uap portabel yang ringan dan fleksibel untuk merapikan pakaian.",
    price: 708400,
    category: "rumah",
    icon: "iron",
    image: "images/steamer-philips.jpg",
    qty: 1,
    link: "https://www.tokopedia.com/philips-estore/philips-handheld-steamer-sth5030-biru-setrika-uap-listrik-paling-fleksibel-portabel-setrika-uap-ringan-philips-setrika-uap-setrika-uap-listrik-strika-uap-setrika-philips-uap-sth5030-20-1730180217855772662"
  },
  {
    id: "gree-circool",
    title: "Gree Circool Air Circulation Fan",
    desc: "Kipas sirkulasi udara dengan Ion Plasma untuk ruang tamu, kamar, dan kantor. Pilihan 13S / 14L.",
    price: 1104000,
    category: "rumah",
    icon: "fan",
    image: "images/gree-circool.jpg",
    qty: 1,
    link: "https://www.tokopedia.com/gadventia/gree-circool-13s-dan-circool-14l-air-circulation-fan-ion-plasma-circool-kipas-angin-pendingin-ruangan-tamu-kamar-tidur-kantor-gcf-circool-13s-gcf-circool-14l-1730355449051318167?aff_unique_id=VjgLB722aX_I8eF11KqyJt5rQmeFGXWAKUhN5sU5TF6EZJQKRGiPk8HC9F6HJMb9dbctIECJPQ%3D%3D&channel=salinlink&utm_source=salinlink&utm_medium=affiliate-share&utm_campaign=affiliateshare-pdp-VjgLB722aX_I8eF11KqyJt5rQmeFGXWAKUhN5sU5TF6EZJQKRGiPk8HC9F6HJMb9dbctIECJPQ%3D%3D-100000258721-0-051026&scene=pdp"
  },
  {
    id: "xiaomi-vacuum-s40c",
    title: "Xiaomi Robot Vacuum S40C",
    desc: "Robot vacuum dan pel otomatis dengan navigasi laser LDS presisi serta daya isap kuat 5.000Pa.",
    price: 2299000,
    category: "rumah",
    icon: "vacuum",
    image: "images/xiaomi-vacuum-s40c.jpg",
    qty: 1,
    link: "https://shopee.co.id/Xiaomi-Robot-Vacuum-S40C-Navigasi-laser-LDS-lebih-presisi-Kontrol-cerdas-via-Xiaomi-Home-App-Sapu-pel-otomatis-dalam-satu-alat-Daya-isap-kuat-5.000Pa-untuk-bersih-maksimal-Tangki-besar-untuk-debu-dan-air-Official-Store--i.1453736730.44173044135?extraParams=%7B%22display_model_id%22%3A177335900503%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    id: "xiaomi-air-purifier-4-compact",
    title: "Xiaomi Air Purifier 4 Compact",
    desc: "Pembersih udara compact dengan filter 3-in-1 dan layar OLED, bisa dikontrol via aplikasi Xiaomi Home.",
    price: 1199000,
    category: "rumah",
    icon: "vacuum",
    image: "images/xiaomi-air-purifier-4-compact.jpg",
    qty: 1,
    link: "https://shopee.co.id/Xiaomi-Air-Purifier-4-Compact-OLED-Filter-3-in-1-Hemat-Energi-Hilangkan-Alergen-Smart-Control-i.550839933.14591288534?extraParams=%7B%22display_model_id%22%3A117253992792%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    id: "remington-s5408",
    title: "Remington Catokan Mineral Glow S5408",
    desc: "Catokan pelurus rambut dengan pelat keramik ber-mineral alami untuk hasil styling halus dan berkilau.",
    price: 799200,
    category: "lainnya",
    icon: "sparkle",
    image: "images/remington-s5408.jpg",
    qty: 1,
    link: "https://shopee.co.id/Remington-Catokan-Pelurus-Rambut-Mineral-Glow-S5408-i.44277832.4465739778?extraParams=%7B%22display_model_id%22%3A161126274006%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    id: "philips-hair-dryer-3000",
    title: "Philips Hair Dryer 3000 BHD308",
    desc: "Pengering rambut 1600W dengan aksesori ThermoProtect yang melindungi rambut dari panas berlebih.",
    price: 389400,
    category: "lainnya",
    icon: "fan",
    image: "images/philips-hair-dryer-3000.jpg",
    qty: 1,
    link: "https://shopee.co.id/Philips-Hair-Dryer-3000-Pengering-Rambut-Melindungi-Rambut-dengan-ThermoProtect-Teknologi-Hitam-BHD308-10-i.438891817.8854227554?extraParams=%7B%22display_model_id%22%3A75392726733%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    id: "xiaomi-coffee-machine",
    title: "Xiaomi Mijia Coffee Machine",
    desc: "Mesin kopi espresso semi-otomatis dengan tekanan hingga 20 Bar dan kontrol suhu NTC presisi.",
    price: 1979000,
    category: "dapur",
    icon: "coffee",
    image: "images/xiaomi-coffee-machine.jpg",
    qty: 1,
    link: "https://shopee.co.id/Xiaomi-Mijia-Coffee-Machine-Series-Xiaomi-Semi-automatic-Espresso-Mijia-Capsule-Coffee-Machine-Ekstraksi-Maksimal-tekanan-hingga-20-Bar-NTC-Kontrol-Suhu-Xiaomi-Official-Store--i.1453736730.43069961379?extraParams=%7B%22display_model_id%22%3A325946735154%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    id: "xiaomi-garment-steamer",
    title: "Xiaomi Handheld Garment Steamer",
    desc: "Setrika uap genggam 1300W dengan pemanasan kurang dari 26 detik, ringan dan mudah dibawa.",
    price: 398000,
    category: "rumah",
    icon: "iron",
    image: "images/xiaomi-garment-steamer.jpg",
    qty: 1,
    link: "https://shopee.co.id/Xiaomi-Handheld-Garment-Steamer-Setrika-Uap-1300W-Rapid-Heating-Kurang-Dari-26-Detik-Garansi-Resmi-i.550839933.28306395374?extraParams=%7B%22display_model_id%22%3A197682090202%2C%22model_selection_logic%22%3A3%7D"
  },
  {
    id: "kintakun-bedcover-b2",
    title: "Kintakun Lite Bedcover Set 160x200",
    desc: "Set bedcover 6-in-1 queen 160x200 dengan sprei fitted tinggi 20 cm, motif bunga minimalis.",
    price: 334000,
    category: "rumah",
    icon: "bed",
    image: "images/kintakun-bedcover.jpg",
    qty: 1,
    link: "https://shopee.co.id/Kintakun-Lite-Bedcover-Set-160x200-Queen-Fitted-T20-cm-Sprei-Set-Aesthetic-Minimalis-Flower-Motif-B2-6in1-i.48708202.16499068893?extraParams=%7B%22display_model_id%22%3A325535660199%2C%22model_selection_logic%22%3A3%7D"
  }
];

/* Dipakai server (api/claims.js) untuk memvalidasi nama tamu terdaftar. */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { GUESTS: GUESTS };
}
