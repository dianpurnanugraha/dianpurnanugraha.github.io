# Portofolio — Dian Purna Nugraha, S.Kom.

Website portofolio statis (HTML + CSS) untuk menampilkan profil, layanan, skill, pengalaman, studi kasus project, dan kontak sebagai E-commerce Operations & Business Operations Specialist.

Live: [dianpurnanugraha.my.id](https://dianpurnanugraha.my.id)

## Struktur Halaman

| File | Deskripsi |
|---|---|
| `index.html` | Halaman utama / landing page |
| `about.html` | Tentang saya |
| `services.html` | Daftar layanan yang ditawarkan |
| `skill.html` | Daftar skill & tools yang dikuasai |
| `experience.html` | Riwayat pengalaman kerja |
| `project.html` | Daftar seluruh studi kasus project |
| `contact.html` | Form/kontak dan tautan sosial media |
| `styles.css` | Semua styling situs |

### Halaman Detail Project (`project-*.html`)

- `project-ads-campaign.html` — Kampanye Iklan Shopee & Facebook Ads
- `project-brosur.html` — Desain Brosur Promosi
- `project-finance-report.html` — Laporan Keuangan & Rekap Otomatis
- `project-fotografi-produk.html` — Fotografi Produk
- `project-instagram-design.html` — Desain Feed Instagram & Konten Promosi
- `project-lazada-setup.html` — Setup & Migrasi Toko ke Lazada
- `project-logo-identitas.html` — Logo & Identitas Brand
- `project-packaging.html` — Desain Packaging Produk
- `project-sales-dashboard.html` — Dashboard Laporan Penjualan Multi-Marketplace
- `project-shopee-tiktok.html` — Optimasi Toko Shopee & TikTok Shop
- `project-sop-workflow.html` — Penyusunan SOP & Workflow Gudang

> Catatan: konten di halaman detail project masih berupa **contoh/ilustrasi** (nama klien, angka hasil, dan gambar). Ganti dengan data project asli sebelum publish.

## Tech Stack

- HTML5 + CSS3 murni (tanpa framework/build tool)
- [Font Awesome 6.5.1](https://cdnjs.cloudflare.com) (ikon, via CDN)
- Google Fonts — Poppins & Inter
- JavaScript vanilla (`nav-toggle.js`) untuk toggle menu mobile

## Ikon Sosial Media

Ikon LinkedIn, GitHub, Instagram, dan WhatsApp memakai Font Awesome. Ikon **Upwork**, **Telegram**, dan **Lynk.id** digambar manual sebagai inline SVG (`currentColor`) di bagian footer setiap halaman dan di bagian sosial media `contact.html`, karena tidak tersedia di Font Awesome free/kit yang dipakai.

Bentuk ikon Lynk.id disusun dari 2 path:
- Arch luar — garis lengkung (`stroke`), ujung kaki rounded, rata sejajar di bagian bawah.
- Arch dalam — bentuk solid menyerupai batu nisan (sisi lurus, sudut bawah rounded, atas melengkung penuh), disejajarkan dengan kaki arch luar.

## Cara Menjalankan Lokal

Karena situs ini statis, cukup buka `index.html` langsung di browser, atau jalankan local server sederhana, misalnya:

```bash
python3 -m http.server 8000
```

lalu buka `http://localhost:8000`.

## Kontak

- Email: dyannugraha.p@gmail.com
- WhatsApp: +62 812 9573 3476
- LinkedIn: [dianpurnanugraha](https://www.linkedin.com/in/dianpurnanugraha/)
