# Mamma Mia — Restaurant Web Documentation

Dokumentasi lengkap struktur, alur, dan cara penggunaan website Marca Restaurant.

---

## Daftar Isi

1. [Struktur File](#struktur-file)
2. [Alur Navigasi](#alur-navigasi)
3. [Halaman per Halaman](#halaman-per-halaman)
4. [Komponen Shared](#komponen-shared)
5. [Sistem Loading](#sistem-loading)
6. [Form Order & Validasi](#form-order--validasi)
7. [Cara Mengganti Konten](#cara-mengganti-konten)

---

## Struktur File

```
web-project/
│
├── index.html          → Halaman utama (Home)
├── menu.html           → Katalog menu restoran
├── order.html          → Form pemesanan
├── reward.html         → Program loyalty & reward
├── about.html          → Profil restoran & founder
│
├── navbar.css          → Shared: navbar desktop & mobile, CSS variables, reset
├── loader.css          → Shared: animasi loading huruf N
├── style.css           → Khusus: Home page
├── menu.css            → Khusus: Menu page
├── order.css           → Khusus: Order page
├── reward.css          → Khusus: Reward page
├── about.css           → Khusus: About page
│
├── script.js           → Shared: loader logic, navbar scroll, fade-in observer
├── order.js            → Khusus: seluruh logika form order
│
└── README.md           → Dokumentasi ini
```

### Aturan CSS

Setiap halaman memuat **dua file CSS**:
- `navbar.css` → selalu dimuat pertama (berisi variables, reset, dan navbar)
- CSS khusus halaman → dimuat kedua (berisi style konten halaman tersebut)

Pendekatan ini menjaga file tetap ringan dan tidak ada duplikasi style antar halaman.

---

## Alur Navigasi

```
[ index.html ]
      │
      ├──── Navbar → menu.html ──→ Klik "Order" per item ──→ order.html
      │
      ├──── Navbar → order.html
      │
      ├──── Navbar → reward.html
      │
      └──── Navbar → about.html
```

### Navbar Behavior

| Kondisi | Tampilan |
|---|---|
| Desktop (> 768px) | Navbar horizontal di atas, link teks uppercase dengan underline animasi |
| Mobile (≤ 768px) | Floating pill di tengah bawah layar, icon + label |

Active state sudah di-hardcode langsung di HTML tiap halaman (bukan via JS) sehingga selalu akurat sesuai halaman yang sedang dibuka.

---

## Halaman per Halaman

### 1. Home (`index.html` + `style.css`)

Tiga section utama:

**Hero** — Tagline restoran, sub-copy, dua tombol CTA (Order Now & Explore Menu), animasi garis scroll.

**Our Signature Picks** — Grid 4 item menu populer. Gambar sudah siap diganti via tag `<img src="" class="card-photo">`.

**Origin Story** — Ringkasan cerita restoran dengan visual kartu bertumpuk dan quote founder.

### 2. Menu (`menu.html` + `menu.css`)

Katalog lengkap dengan tiga kategori yang bisa diswitch via tab sticky:

- **Makanan** — 5 item
- **Minuman** — 4 item
- **Dessert** — 4 item

Setiap item punya: gambar (siap diisi), badge tag, nama, deskripsi, harga, dan tombol Order yang mengarah ke `order.html`.

Gambar menu diisi via: `<img src="path/gambar.jpg" class="menu-item-photo">`.

### 3. Order (`order.html` + `order.css` + `order.js`)

Form pemesanan lengkap. Lihat seksi [Form Order & Validasi](#form-order--validasi) untuk detail.

### 4. Reward (`reward.html` + `reward.css`)

Tiga bagian:

**Points Bar** — Menampilkan poin dan tier customer (saat ini statis, bisa dihubungkan ke backend).

**How it Works** — Tiga langkah: Order & Earn → Reach a Tier → Redeem Anytime.

**Reward Gallery** — 8 reward dalam grid:
- Tier Rewards: Bronze (100 pts), Silver (300 pts), Gold (700 pts)
- Redeemable: Free Drink, Voucher Rp 20rb, Free Dessert, Bring a Friend, Chef's Table, Private Dining

### 5. About (`about.html` + `about.css`)

Enam section:

| Section | Isi |
|---|---|
| Hero | Judul besar + gambar interior + pull quote |
| Origin Story | Narasi Rizal & Nadia memulai dari warung 4 meja, 2018 |
| Philosophy | *Cucina onesta* — tiga pilar: Ingredients First, Respect the Process, Feed with Intention |
| Image Break | Full-width foto dengan quote overlay |
| Founders | Kartu Rizal Santoso & Nadia Santoso dengan bio dan kutipan |
| Closing | Gambar dining room + ajakan order |

---

## Komponen Shared

### CSS Variables (`navbar.css`)

Semua warna, font, dan spacing didefinisikan sebagai CSS variable di `:root`:

```css
--bg              → #0e0e0f  (background utama)
--surface         → #1a1a1c  (card, input)
--surface-hover   → #242426  (hover state)
--border          → rgba(255,255,255,0.08)
--text-primary    → #f0ede8
--text-muted      → #8a8580
--accent          → #c9a96e  (gold — warna utama brand)
--accent-dim      → rgba(201,169,110,0.15)
--font-display    → Cormorant Garamond (serif, untuk judul)
--font-body       → DM Sans (sans-serif, untuk teks)
```

Untuk mengubah warna brand, cukup edit `--accent` di `navbar.css` dan seluruh halaman ikut berubah.

### Navbar Mobile

Navbar mobile adalah floating pill di bagian bawah layar dengan 5 icon menu. Styling diatur di `navbar.css` dalam media query `@media (max-width: 768px)`.

---

## Sistem Loading

Loading hanya muncul **sekali per sesi** — saat pertama buka atau refresh manual. Navigasi antar halaman tidak memunculkan loading kembali.

### Cara Kerja

```
Halaman dibuka
      │
      ├── sessionStorage ada? ──→ YA → Skip loader, konten langsung muncul
      │
      └── TIDAK → Tampilkan animasi N → Tunggu 1.8 detik
                        │
                        └── Set sessionStorage → Fade out loader → Konten muncul
```

### Animasi Huruf N

Huruf N italic serif digambar stroke per stroke via CSS `stroke-dashoffset` animation:

1. Serif bawah kiri
2. Serif atas kiri
3. Stem kiri (tebal, dari bawah ke atas)
4. Serif atas kanan
5. Diagonal (tipis)
6. Stem kanan
7. Serif bawah kanan
8. Glow pulse + garis ornamental

Animasi diatur di `loader.css`. Durasi total ±1.6 detik.

---

## Form Order & Validasi

### Komponen Form (`order.html`)

| No | Komponen | Tipe | Keterangan |
|---|---|---|---|
| 1 | Service Option | Radio Cards | Pickup / Delivery — visual card dengan icon |
| 2 | Delivery Address | Textarea | Muncul hanya jika Delivery dipilih |
| 3 | Nama & Telepon | Text Input | Grid dua kolom |
| 4 | Menu Selector | Custom Dropdown | Emoji + nama + deskripsi + harga, ada search filter |
| 5 | Extra Toppings | Checkbox Grid | 6 pilihan opsional |
| 6 | Eating Utensils | Toggle Switch | 3 pilihan opsional dengan animasi slide |
| 7 | Payment Method | Radio Pills | 5 metode dengan panel detail masing-masing |
| 8 | Special Notes | Textarea | Opsional, max 300 karakter dengan counter |

### Panel Payment Detail

Setiap metode pembayaran menampilkan panel info berbeda saat dipilih:

| Metode | Info yang Tampil |
|---|---|
| Cash | Instruksi bayar saat terima pesanan |
| Bank Transfer | No. Rek BCA & Mandiri + tombol Copy |
| QRIS | Kotak placeholder untuk gambar QR code |
| GoPay | Nomor GoPay + tombol Copy |
| OVO | Nomor OVO + tombol Copy |

### Validasi (`order.js`)

Semua validasi ditulis manual **tanpa Regular Expression**:

| No | Field | Aturan Validasi |
|---|---|---|
| 1 | Service | Wajib pilih salah satu (pickup/delivery) |
| 2 | Alamat | Wajib diisi & minimal 10 karakter jika Delivery dipilih |
| 3 | Nama | Wajib, tidak boleh mengandung angka (cek `charCodeAt`), minimal 2 kata |
| 4 | Telepon | Wajib, harus diawali `0` atau `+`, hanya digit, panjang 9–13 angka |
| 5 | Menu | Minimal satu item harus dipilih |
| 6 | Payment | Wajib pilih salah satu metode |

Validasi berjalan dua kali: saat field kehilangan fokus (blur) dan saat form di-submit.

### Order Summary

Summary otomatis terupdate real-time setiap kali:
- Item menu dipilih dari dropdown
- Quantity `+` atau `−` ditekan
- Item dihapus

Menampilkan subtotal, pajak & service (10%), dan total akhir.

### Alur Submit

```
Klik "Place Order"
      │
      ├── Validasi gagal? → Scroll ke error pertama, highlight field merah
      │
      └── Semua valid → Tombol disabled + teks "Placing Order…"
                              │
                              └── 600ms → Success modal muncul
                                              │
                                              └── Klik "Back to Menu" → menu.html
```

---

## Cara Mengganti Konten

### Mengganti Gambar Menu (Homepage)

Di `index.html`, cari tag dengan class `card-photo` dan isi atribut `src`:

```html
<img src="images/nasi-bakar.jpg" alt="Nasi Bakar Rempah" class="card-photo" />
```

### Mengganti Gambar Menu (Menu Page)

Di `menu.html`, cari tag dengan class `menu-item-photo`:

```html
<img src="images/nasi-bakar.jpg" alt="Nasi Bakar Rempah" class="menu-item-photo" />
```

### Mengganti Gambar About

Di `about.html`, ada 6 slot gambar dengan class `about-photo`:

```html
<!-- Interior restoran -->
<img src="images/interior.jpg" alt="Marca restaurant interior" class="about-photo" />

<!-- Foto founder -->
<img src="images/rizal.jpg" alt="Rizal Santoso" class="about-photo founder-photo" />
<img src="images/nadia.jpg" alt="Nadia Santoso" class="about-photo founder-photo" />
```

### Mengganti Nomor Rekening / E-Wallet

Di `order.html`, cari bagian payment detail dan edit atribut `data-copy` dan teks nomor:

```html
<!-- Bank Transfer -->
<span class="pay-account-num">1234 5678 90</span>
<button type="button" class="pay-copy-btn" data-copy="1234567890">

<!-- GoPay / OVO -->
<span class="pay-account-num">0812 3456 7890</span>
<button type="button" class="pay-copy-btn" data-copy="081234567890">
```

### Mengganti QRIS

Di `order.html`, ganti blok `.pay-qris-placeholder` dengan tag `<img>`:

```html
<div class="pay-qris-box">
  <img src="images/qris.png" alt="QRIS Marca" style="width:160px;height:160px;border-radius:12px;" />
</div>
```

### Menambah Item Menu Baru

Di `menu.html`, duplikat satu blok `.menu-item` dan sesuaikan isinya. Di `order.js`, tambahkan entry baru ke array `MENU`:

```js
{ cat:'Makanan', emoji:'🍜', name:'Nama Menu Baru', desc:'Deskripsi singkat', price:'Rp 50.000', value:'nama-menu-baru' },
```

### Mengganti Warna Brand

Cukup edit satu variable di `navbar.css`:

```css
:root {
  --accent: #c9a96e;  
}
```

---

*Marca Restaurant Web — Built with HTML, CSS, and Vanilla JS*