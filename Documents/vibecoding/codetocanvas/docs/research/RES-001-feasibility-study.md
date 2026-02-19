# Laporan Riset: Alat Desain & Kode Dua Arah Berbasis AI

## Ringkasan Eksekutif
Laporan ini mengeksplorasi kelayakan dan kemungkinan arsitektur untuk membuat alat yang menjembatani "Code to Canvas" (Vibecoding ke Desain) dan "Canvas to Code" (Desain ke Pengembangan), yang diperkuat oleh Google Stitch dan Gemini CLI.

## 1. Pernyataan Masalah
Tujuannya adalah memungkinkan alur kerja (workflow) yang cair di mana:
1.  **Vibecoding -> Sesuaikan Desain**: Pengembang menulis/menghasilkan kode, dan hasilnya dapat diedit dalam kanvas visual (seperti Figma).
2.  **Desain -> Sesuaikan Kode**: Desainer membuat/mengedit di kanvas (Stitch/Figma), dan perubahannya tercermin dalam basis kode (codebase Gemini CLI).

## 2. Analisis Stack Teknologi

### 2.1 Google Stitch (Canvas to Code)
*   **Kemampuan**: Menghasilkan UI dari prompt/gambar, ekspor ke React/HTML dan Figma.
*   **Integrasi MCP**: Memungkinkan pembuatan dan modifikasi layar secara programatik.
*   **Kekurangan**: Saat ini dioptimalkan untuk *menghasilkan* desain baru, bukan *mengimpor* basis kode React yang kompleks tanpa kehilangan data.

### 2.2 Gemini CLI (Kecerdasan Kode)
*   **Kemampuan**: Agen pengkodean yang sadar konteks, refactoring, memahami basis kode yang kompleks.
*   **Peran**: Bertindak sebagai "Coder" yang menafsirkan perubahan desain dan memperbarui kode sumber.

## 3. Analisis Workflow

### 3.1 Kasus 1: Vibedesign (Stitch) -> Code -> Custom Tool -> Update
1.  **Vibedesign (Stitch)**: Pengguna membuat desain awal melalui prompt di Stitch.
2.  **Build (Gemini CLI)**: Gemini CLI mengambil output Stitch (HTML/React) dan membangun kerangka aplikasi.
3.  **Edit Visual (Custom Tool)**:
    *   *Tantangan*: Alat kustom harus memuat *kode lokal* yang dihasilkan oleh Gemini CLI.
    *   *Mekanisme*: Alat bertindak sebagai server/editor lokal yang me-render kode React.
4.  **Update**: Perubahan pada alat ditulis kembali ke kode.

### 3.2 Kasus 2: Vibecoding (Gemini CLI) -> Custom Tool -> Update
1.  **Vibecoding (Gemini CLI)**: Pengguna menulis kode/prompt di terminal untuk membangun fitur.
2.  **Edit Visual (Custom Tool)**:
    *   *Tantangan*: "Code to Canvas". Alat harus mem-parsing kode React arbitrer dan membuatnya dapat diedit secara visual.
    *   *Tingkat Kesulitan*: Tinggi. Membutuhkan pemetaan elemen DOM kembali ke lokasi kode sumber (AST).
3.  **Update**: "Canvas to Code". Perubahan visual (misal: mengubah padding) harus memperbarui kode sumber React, bukan hanya inline styles.

## 4. Kelayakan Teknis & Solusi

### 4.1 "Code to Canvas" (Bagian Tersulit)
*   **Tantangan**: Mengonversi aplikasi React yang sedang berjalan kembali menjadi format desain yang dapat diedit tanpa kehilangan data.
*   **Temuan**:
    *   **Jangan gunakan Figma untuk 'Code to Canvas'**: Mengonversi React -> Figma bersifat *lossy* (hilang data) dan kompleks.
    *   **Solusi**: **Editing Visual React Native**. Gunakan "Editor Overlay" yang berinteraksi langsung dengan DOM dan Kode Sumber.
*   **Teknologi yang Direkomendasikan**:
    *   **Onlook**: Editor visual open-source yang memungkinkan pengeditan aplikasi React secara langsung ("seperti Figma") dan menulis perubahan kembali ke kode. Ini sangat cocok dengan kebutuhan "Kasus 2".
    *   **Puck**: Pembuat halaman drag-and-drop menggunakan model data JSON. Bagus untuk "Page Building" tetapi kurang cocok untuk pengeditan kode arbitrer.

### 4.2 "Canvas to Code"
*   **Stitch API**: Sangat baik untuk *pembuatan awal* (Greenfield). Menghasilkan kode HTML/React yang bersih.
*   **Custom Tool**: Untuk "Vibe Editor", kita perlu memodifikasi **Abstract Syntax Tree (AST)** dari kode yang ada.
    *   *Mekanisme*: Ketika pengguna mengedit komponen secara visual (misal: mengubah warna), alat menggunakan skrip Babel/AST khusus untuk memperbarui properti (prop) tertentu dalam file sumber.

## 5. Arsitektur yang Diusulkan: "The Vibe Editor"

Untuk mencapai impian "Vibe Design" + "Vibe Coding", kami mengusulkan untuk membangun **"The Vibe Editor"**:

### 5.1 Diagram Arsitektur
1.  **"Vibe Engine" (Backend)**:
    *   **Gemini CLI**: "Otak". Menangani pembaruan logika yang kompleks (misal: "Refactor komponen ini untuk menggunakan hook").
    *   **Stitch API**: "Seniman". Menghasilkan konsep visual/layar baru dari awal.
    *   **AST Manager**: Layanan Node.js lokal (berbasis `react-ast` atau `jscodeshift`) yang menangani pembaruan kode atomik yang presisi (misal: mengubah props, memindahkan elemen).

2.  **"Vibe Canvas" (Frontend)**:
    *   **Preview Lokal**: Me-render aplikasi pengguna yang sedang berjalan (Next.js/Vite) di dalam iframe atau wrapper.
    *   **Visual Overlay**: Antarmuka mirip Onlook/Storybook yang berada *di atas* aplikasi.
        *   *Seleksi*: Mengarahkan kursor ke elemen akan menyoroti komponen React-nya.
        *   *Editing*: Sidebar memungkinkan pengubahan kelas Tailwind, inline styles, dan konten teks.

### 5.2 Alur Kerja Terpadu (Gabungan Kasus 1 & 2)
1.  **Drafting**: Pengguna meminta **Stitch** (via prompt) untuk "Buat dashboard modern".
    *   *Hasil*: Stitch memberikan kode React.
2.  **Refining (Vibe Coding)**: Pengguna menggunakan **Gemini CLI** untuk "Buat sidebar bisa dilipat (collapsible)".
    *   *Hasil*: Gemini CLI merefactor kode.
3.  **Tweaking (Vibe Design)**: Pengguna membuka **Vibe Editor**. Mereka melihat sidebar terlalu lebar. Mereka menyeretnya untuk mengubah ukuran.
    *   *Hasil*: Vibe Editor memperbarui kelas `w-64` menjadi `w-48` di file sumber secara langsung.

## 6. Kesimpulan
Visi "Vibecoding" ini **sangat layak**.
*   **Kasus 1** ditingkatkan dengan menggunakan Stitch untuk "percikan" awal dan Gemini CLI untuk pembangunan.
*   **Kasus 2** diselesaikan dengan mengintegrasikan lapisan "Visual Editor" (terinspirasi oleh Onlook) yang memungkinkan penyesuaian desain mengalir kembali ke kode.

**Langkah Selanjutnya**:
1.  Membuat prototipe "Vibe Editor" menggunakan aplikasi Next.js sederhana yang dapat membaca/menulis file sumbernya sendiri.
2.  Mengintegrasikan Stitch API untuk memungkinkan "Drag and Drop" bagian/section baru yang dihasilkan AI.
