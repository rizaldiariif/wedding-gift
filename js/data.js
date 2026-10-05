/* ============================================================
   SEMUA KONTEN WEBSITE DIATUR DI FILE INI.
   Ubah nama, tanggal, hadiah, rekening, dan nomor WhatsApp
   sesuai kebutuhan. Tidak perlu menyentuh file lain.
   ============================================================ */

const CONFIG = {
  couple: {
    groom: "Rizaldi",
    bride: "Defalia",
    monogram: "R & D",
    shortNames: "Rizaldi & Defalia",
    names: "Rizaldi & Defalia"
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
    whatsapp: "6281234567890",
    phoneLabel: "+62 812-3456-7890"
  }
};

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
  send: '<path d="M21 3L3 11l7 2 2 7 9-17z"/><path d="M21 3l-11 10"/>'
};

const GIFTS = [
  {
    id: "stand-mixer",
    title: "Stand Mixer Premium",
    desc: "Untuk membuat kue dan roti homemade kesukaan kami berdua.",
    price: 8999000,
    category: "dapur",
    icon: "mixer",
    qty: 1,
    featured: true,
    link: "https://www.tokopedia.com/search?st=product&q=stand%20mixer"
  },
  {
    id: "air-fryer",
    title: "Air Fryer XXL",
    desc: "Memasak lebih sehat dan praktis untuk menu sehari-hari.",
    price: 2499000,
    category: "dapur",
    icon: "airfryer",
    qty: 1,
    featured: true,
    link: "https://www.tokopedia.com/search?st=product&q=air%20fryer"
  },
  {
    id: "blender",
    title: "Blender Premium",
    desc: "Untuk jus, smoothie, dan bumbu masakan harian.",
    price: 1250000,
    category: "dapur",
    icon: "blender",
    qty: 1,
    link: "https://www.tokopedia.com/search?st=product&q=blender"
  },
  {
    id: "rice-cooker",
    title: "Rice Cooker 1.8L",
    desc: "Penanak nasi digital dengan pengatur waktu dan penghangat.",
    price: 1850000,
    category: "dapur",
    icon: "ricecooker",
    qty: 1,
    link: "https://www.tokopedia.com/search?st=product&q=rice%20cooker"
  },
  {
    id: "set-pisau",
    title: "Set Pisau Stainless",
    desc: "Satu set pisau dapur lengkap dengan talenan kayu.",
    price: 950000,
    category: "dapur",
    icon: "knife",
    qty: 1,
    link: "https://www.tokopedia.com/search?st=product&q=set%20pisau%20dapur"
  },
  {
    id: "dinner-set",
    title: "Dinner Set Porselen 24 pcs",
    desc: "Set piring dan mangkuk porselen untuk jamuan keluarga.",
    price: 1500000,
    category: "dapur",
    icon: "plate",
    qty: 1,
    link: "https://www.tokopedia.com/search?st=product&q=dinner%20set%20porselen"
  },
  {
    id: "coffee-maker",
    title: "Coffee Maker Espresso",
    desc: "Untuk menemani pagi kami dengan kopi racikan sendiri.",
    price: 3900000,
    category: "dapur",
    icon: "coffee",
    qty: 1,
    featured: true,
    link: "https://www.tokopedia.com/search?st=product&q=coffee%20maker%20espresso"
  },
  {
    id: "robot-vacuum",
    title: "Robot Vacuum Cleaner",
    desc: "Membantu membersihkan rumah secara otomatis setiap hari.",
    price: 3750000,
    category: "rumah",
    icon: "vacuum",
    qty: 1,
    featured: true,
    link: "https://www.tokopedia.com/search?st=product&q=robot%20vacuum"
  },
  {
    id: "handuk",
    title: "Set Handuk Premium",
    desc: "Handuk katun tebal ala hotel, lembut dan menyerap.",
    price: 850000,
    category: "rumah",
    icon: "towel",
    qty: 2,
    link: "https://www.tokopedia.com/search?st=product&q=set%20handuk"
  },
  {
    id: "bedding",
    title: "Bedding Set King 500TC",
    desc: "Seprai katun 500 thread count untuk kamar utama kami.",
    price: 1750000,
    category: "rumah",
    icon: "bed",
    qty: 1,
    link: "https://www.tokopedia.com/search?st=product&q=bedding%20set%20king"
  },
  {
    id: "setrika",
    title: "Setrika Uap",
    desc: "Setrika uap dengan pelat keramik agar pakaian rapi maksimal.",
    price: 799000,
    category: "rumah",
    icon: "iron",
    qty: 1,
    link: "https://www.tokopedia.com/search?st=product&q=setrika%20uap"
  },
  {
    id: "dispenser",
    title: "Dispenser Panas & Dingin",
    desc: "Dispenser air untuk kebutuhan minum keluarga.",
    price: 1450000,
    category: "rumah",
    icon: "dispenser",
    qty: 1,
    link: "https://www.tokopedia.com/search?st=product&q=dispenser%20air"
  },
  {
    id: "lampu-meja",
    title: "Lampu Meja Nordic",
    desc: "Lampu meja hangat untuk sudut baca dan ruang keluarga.",
    price: 650000,
    category: "rumah",
    icon: "lamp",
    qty: 2,
    link: "https://www.tokopedia.com/search?st=product&q=lampu%20meja"
  },
  {
    id: "smart-tv",
    title: 'Smart TV 50" 4K',
    desc: "Untuk nonton bareng di ruang keluarga kami nanti.",
    price: 5999000,
    category: "elektronik",
    icon: "tv",
    qty: 1,
    link: "https://www.tokopedia.com/search?st=product&q=smart%20tv%2050%20inch"
  },
  {
    id: "kamera",
    title: "Kamera Mirrorless",
    desc: "Merekam momen kecil perjalanan kami sebagai suami istri.",
    price: 12500000,
    category: "elektronik",
    icon: "camera",
    qty: 1,
    link: "https://www.tokopedia.com/search?st=product&q=kamera%20mirrorless"
  },
  {
    id: "speaker",
    title: "Speaker Bluetooth",
    desc: "Musik untuk menemani waktu bersantai di rumah.",
    price: 2299000,
    category: "elektronik",
    icon: "speaker",
    qty: 1,
    link: "https://www.tokopedia.com/search?st=product&q=speaker%20bluetooth"
  },
  {
    id: "koper",
    title: "Koper Set Premium",
    desc: "Teman perjalanan untuk bulan madu dan liburan kami.",
    price: 2750000,
    category: "lainnya",
    icon: "luggage",
    qty: 1,
    link: "https://www.tokopedia.com/search?st=product&q=koper%20set"
  },
  {
    id: "bulan-madu",
    title: "Dana Bulan Madu",
    desc: "Kontribusi untuk mewujudkan perjalanan bulan madu impian kami.",
    price: 1000000,
    priceLabel: "Rp 1.000.000 / bagian",
    category: "lainnya",
    icon: "plane",
    qty: 10,
    featured: true,
    link: ""
  },
  {
    id: "tanda-kasih",
    title: "Tanda Kasih / Amplop Digital",
    desc: "Nominal bebas. Silakan konfirmasi via WhatsApp untuk detailnya.",
    price: null,
    priceLabel: "Nominal bebas",
    category: "lainnya",
    icon: "wallet",
    qty: 1,
    link: ""
  }
];
