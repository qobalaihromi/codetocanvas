# Product Requirements Document (PRD): Vibe Editor

## 1. Pendahuluan
**Vibe Editor** adalah alat pengembangan hibrida yang menjembatani kesenjangan antara desain visual (*Vibedesign*) dan penulisan kode (*Vibecoding*). Alat ini memungkinkan pengembang dan desainer untuk berkolaborasi dalam satu lingkungan di mana perubahan visual memperbarui kode, dan perubahan kode memperbarui tampilan visual secara real-time.

## 2. Masalah yang Diselesaikan
*   **Silo Desain vs Dev**: Desain di Figma sering tidak sinkron dengan kode produksi.
*   **Kesulitan Tweaking**: Mengubah padding/margin/warna di kode memerlukan trial-and-error angka.
*   **Kehilangan Konteks AI**: Alat AI generate kode sering kali "lupa" struktur proyek saat diminta mengubah detail kecil.

## 3. Profil Pengguna (User Personas)
*   **The Vibecoder (Developer)**: Lebih suka ngoding di terminal, tapi butuh cara cepat untuk fix UI tanpa inspect element berkali-kali.
*   **The Vibedesigner (Technical Designer)**: Ingin mengedit tampilan aplikasi yang *hidup*, bukan mockup statis, dan perubahannya langsung jadi commit git.

## 4. Fitur & Fungsionalitas (Functional Requirements)

### 4.1 Vibe Canvas (Visual Editor)
*   **FR-01**: Mampu me-render aplikasi Next.js/Vite lokal pengguna di dalam wadah yang aman (Iframe/Webview).
*   **FR-02**: Menyediakan alat "Select" untuk mengidentifikasi komponen React dari elemen visual yang diklik.
*   **FR-03**: Menampilkan "Inspector Panel" untuk melihat properti Tailwind dan Props React dari elemen yang dipilih.
*   **FR-04**: Mendukung manipulasi langsung (Drag & Drop) untuk margin/padding (Stretch goal).

### 4.2 Vibe Engine (AST Manager)
*   **FR-05**: Mampu membaca file sumber (`.tsx`, `.jsx`) dan mem-parsingnya menjadi Abstract Syntax Tree (AST).
*   **FR-06**: Mampu menyuntikkan ID unik (`data-vibe-id`) ke elemen saat mode development untuk pelacakan.
*   **FR-07**: Mampu melakukan "Surgical Update" (Pembaruan Bedah): Mengubah nilai prop spesifik tanpa mengubah format kode lain (termasuk komentar).
*   **FR-08**: Mendukung undo/redo perubahan file.

### 4.3 AI Integration (The Bridge)
*   **FR-09 (Gemini CLI)**: Integrasi untuk refactoring logika. Button "Refactor with AI" mengirimkan konteks komponen ke Gemini.
*   **FR-10 (Stitch API)**: Integrasi untuk generasi UI. Drag area kosong -> Prompt "Buat Login Form" -> Stitch menghasilkan kode -> Engine menyuntikkan ke file.

### 4.4 Vibe Freeform Mode (New)
*   **FR-11**: Mode "Bebas" di mana elemen bisa digeser ke koordinat mana saja (Absolute Positioning).
*   **FR-12**: Fitur "Vibeify" (AI Clean Up) untuk mengonversi layout Grid/Flexbox yang berantakan (Absolute) kembali menjadi kode terstruktur (Flex/Grid) menggunakan Gemini.

### 4.5 Embedded Terminal (New)
*   **FR-13**: Terminal terintegrasi di dalam editor untuk menjalankan perintah CLI (termasuk `gemini-cli`, `npm install`, `git commit`).
*   **FR-14**: Terminal harus berbagi konteks file yang sedang dibuka di editor.

## 5. Non-Functional Requirements
*   **Performance**: Overhead runtime di aplikasi pengguna harus < 50ms.
*   **Safety**: Editor tidak boleh merusak kode (syntax error) saat melakukan update otomatis. Backup file otomatis sebelum write.
*   **Compatibility**: Mendukung Next.js (App Router & Pages Router) dan Vite.

## 6. Alur Kerja Pengguna (User Stories)

### US-1: "Pixel Perfecting"
*   *Sebagai* Vibedesigner,
*   *Saya ingin* mengklik tombol di layar dan mengubah warna background-nya melalui color picker,
*   *Sehingga* kode Tailwind `bg-red-500` otomatis tertulis di file `Button.tsx` saya.

### US-2: "AI Refactoring"
*   *Sebagai* Vibecoder,
*   *Saya ingin* memilih sebuah `div` yang berantakan dan meminta AI "Rapikan ini jadi komponen terpisah",
*   *Sehingga* kode tersebut diekstrak menjadi file baru dan di-import otomatis.

### US-3: "Freeform Design"
*   *Sebagai* Vibedesigner,
*   *Saya ingin* menyeret tombol dan teks ke posisi sembarang tanpa memikirkan margin/flexbox,
*   *Sehingga* saya bisa bereksperimen visual dengan cepat, lalu membiarkan AI membereskannya menjadi kode rapi nanti.

## 7. Roadmap & Fase

### Fase 1: Prototipe (Minggu 1-2)
*   Setup target app (Next.js).
*   Implementasi `jscodeshift` script untuk ganti prop className.
*   UI Overlay sederhana (Click to log file path).

### Fase 2: Editor Dasar (Minggu 3-4)
*   Integrasi UI Panel dengan AST Engine.
*   Support Tailwind Class editing dasar.

### Fase 3: AI Power (Minggu 5+)
*   Integrasi Gemini CLI untuk refactoring.
*   Integrasi Stitch untuk drag-and-drop generation.
