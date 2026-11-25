<!-- ALL Create by LamberthRumpaidus -->
<div align="center">
  <img src="./icon-512.png" alt="Identitas visual Indie Legends Arcade Island" width="150" />
  <h1>Indie Legends Arcade Island</h1>
  <p>Portal permainan arcade gratis berbasis browser.</p>
  <p><a href="https://indielegendsarcadeisland.netlify.app/">Mainkan koleksi</a> · <a href="https://github.com/lamberthrumpaidus/lamberthrumpaidus">Profil pengembang</a></p>
</div>

---

## Gambaran umum

Indie Legends Arcade Island (ILAI) menggabungkan 104 permainan dalam satu portal dengan variasi aksi, balapan, teka-teki, permainan klasik, dan petualangan. Katalog dirancang untuk perangkat seluler maupun komputer, dengan dukungan offline untuk konten yang tersedia secara lokal.

## Permainan unggulan

| Permainan | Pengalaman |
|---|---|
| SHINRIN — Spirit Forest | Eksplorasi hutan bernuansa Jepang |
| Spirit Arena | Pengalaman dengan rendering WebGL dan mode kompatibilitas |
| [RUBAKA](https://github.com/lamberthrumpaidus/Rubaka) | Aksi-platformer |
| [LANDLORD](https://github.com/lamberthrumpaidus/LANDLORD) | Petualangan fantasi 3D |
| [LAST ASYLUM](https://github.com/lamberthrumpaidus/Last-Asylum) | Survival dan pengelolaan sumber daya |

Integrasi permainan unggulan dicatat dalam `featured-games.lock.json` agar versi sumber yang digunakan dapat ditelusuri.

## Teknologi dan struktur

HTML, CSS, JavaScript, WebGL, service worker, serta Three.js sebagai dependensi build opsional.

| Lokasi | Fungsi |
|---|---|
| `games/` | Koleksi permainan |
| `src/` | Kode portal |
| `optional/` | Modul rendering opsional |
| `tools/` | Build dan pengujian |
| [docs/](./docs/README.md) | Dokumentasi teknis |

## Pengembangan lokal

```bash
git clone https://github.com/lamberthrumpaidus/Indie-Legends-Arcade-Island.git
cd Indie-Legends-Arcade-Island
npm install
npm test
npm run build
```

Gunakan `npm run build:three` apabila memerlukan bundel Three.js opsional. Detail arsitektur tersedia di [dokumentasi proyek](./docs/PREMIUM_ARCHITECTURE.md).

---

<div align="center">
  <sub>Dikembangkan oleh <a href="https://github.com/lamberthrumpaidus/lamberthrumpaidus">Lamberth Rumpaidus</a></sub>
</div>
