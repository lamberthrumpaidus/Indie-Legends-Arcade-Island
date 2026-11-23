# Indie Legends Arcade Island

**Create by LamberthRumpaidus.**

Website game indie dengan 23 permainan (22 game arcade/puzzle dan SHINRIN), tanpa iklan. Nama dan logo baru ditempatkan di halaman utama serta favicon. Monogram L/R asli yang diberikan oleh pemilik muncul hanya pada footer (file asli juga disertakan). Selama gameplay, tidak ada logo branding yang mengganggu.

## Instalasi Netlify

Unggah ZIP ini ke Netlify Drop, atau ekstrak dan deploy folder yang isinya memiliki `index.html` pada root. Tidak perlu npm, proses build, ataupun koneksi API.

## Pemakaian

- Laptop: keyboard dan mouse.
- HP: sentuhan dan tombol virtual saat permainan membutuhkannya; kontrol ditinggikan untuk ruang navigasi HP.
- Akses awal melalui Netlify butuh internet; service worker menyimpan aset lokal untuk pemakaian berikutnya di browser yang mendukung.
- File HTML mandiri (`INDIE_LEGENDS_ARCADE_ISLAND_OFFLINE.html`) bisa dibuka langsung tanpa internet.
- SHINRIN memiliki renderer Canvas cadangan ketika WebGL2 tidak tersedia.

## File brand

- `assets/brand/island-emblem.webp`: logo aplikasi baru.
- `assets/brand/favicon.png`, `icon-192.png`, `icon-512.png`: ikon browser/aplikasi.
- `assets/brand/lamberth-credit.png`: logo pribadi untuk footer, dipangkas area transparannya saja.
- `assets/brand/lamberth-original.png`: salinan persis file logo pribadi yang diunggah.

## Batasan

Hasil pengujian simulasi browser tidak menggantikan pengujian HP dan laptop fisik. Ketersediaan offline melalui Netlify bergantung pada keberhasilan cache browser.
