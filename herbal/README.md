# Katalog Herbal

Katalog statis berbahasa Indonesia, mandiri dalam folder `herbal/`. Tidak ada perubahan pada file portofolio yang sudah ada.

## Menjalankan

Jalankan `python3 -m http.server 8080 --directory herbal` dari root repositori, kemudian buka http://localhost:8080. Tidak perlu npm, build, atau backend. Membuka index.html langsung juga didukung.

## Fitur

- Tampilan responsif desktop dan ponsel.
- Foto asli dari aset portofolio, disalin agar folder bisa dipublikasikan mandiri.
- Pencarian, filter kategori, urutan nama, dialog detail produk.
- Keranjang daftar pilihan dengan jumlah 1–99, hapus, salin, dan penyimpanan lokal browser.
- Tautan pembelian per produk: Shopee, TikTok Shop, Lynk.id. Keranjang tidak ditransfer otomatis ke marketplace.

## Lengkapi sebelum peluncuran

Nama sementara situs adalah “herbal”. Konfirmasi nama toko/brand yang akan dipakai.

Data ada di `products.js`. Konfirmasi pilihan produk, ukuran, foto, harga, serta URL produk milik toko. Harga tidak dibuat-buat; `null` menampilkan “Harga belum tersedia”. URL kosong menampilkan “Link pembelian produk ini segera tersedia”.

Contoh format satu produk (ganti angka dan URL dengan data asli):

```js
price: null,
links: {
  // shopee: 'https://...URL-PRODUK-ASLI...',
  // tiktok: 'https://...URL-PRODUK-ASLI...',
  // lynk: 'https://...URL-PRODUK-ASLI...'
}
```

Situs tidak menerima pembayaran, tidak mengumpulkan alamat, tidak menghitung ongkir, dan tidak mencatat pesanan di server. Harga/stok/ongkir akhir mengikuti platform tujuan. Keranjang adalah daftar pilihan, bukan pesanan.

## Hosting dan subdomain

Kode disimpan di GitHub. Jangan gunakan GitHub Pages untuk katalog transaksi ini: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

Folder `herbal/` dapat diunggah sebagai website statis ke host yang mengizinkan penggunaan komersial, misalnya Cloudflare Pages. Pilih deployment/upload folder ini saja (bukan seluruh portofolio). Untuk integrasi Git, arahkan branch sumber ke branch katalog dan root/output ke folder herbal sesuai konfigurasi host; tidak diperlukan build.

Setelah host memberi alamat website, tambahkan custom domain `herbal.dianpurnanugraha.my.id` pada host. Ikuti record DNS yang diberikan host, kemudian tambahkan record subdomain `herbal` pada pengelola DNS otoritatif domain (belum tentu IDCloudHost jika nameserver sudah dialihkan). Jangan mengubah record domain utama. HTTPS harus aktif sebelum peluncuran. Tidak ada perubahan DNS atau CNAME portofolio dilakukan dalam perubahan ini.
