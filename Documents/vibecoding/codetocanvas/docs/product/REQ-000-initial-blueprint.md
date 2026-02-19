# Vibe Editor: Project Blueprint

## 1. Latar Belakang & Visi
Tujuan proyek ini adalah menciptakan alat yang menjembatani kesenjangan antara desain visual ("Vibedesign") dan pengkodean ("Vibecoding"). Alat ini akan memungkinkan developer dan desainer untuk bekerja secara dua arah: dari ide visual ke kode, dan dari kode yang sudah ada kembali ke penyesuaian visual, dengan bantuan AI (Gemini).

## 2. Alur Kerja Inti (Core Workflows)

Berdasarkan diskusi, sistem ini harus menangani dua kasus utama:

### Kasus 1: Design-First (Stitch -> Code -> Tweak)
1.  **Inspirasi**: Pengguna menggunakan **Google Stitch** untuk menghasilkan desain awal (Visual/React).
2.  **Konstruksi**: **Gemini CLI** membangun struktur aplikasi (scaffolding) berdasarkan output Stitch.
3.  **Penyesuaian (Vibe Editor)**:
    *   Pengguna membuka aplikasi di mesin lokal.
    *   Menggunakan **Vibe Editor** untuk menyesuaikan detail visual (margin, warna, font) secara real-time.
    *   Perubahan disimpan langsung ke file kode sumber.

### Kasus 2: Code-First (Code -> Visual Tweak -> Code)
1.  **Pengkodean**: Pengguna menulis kode ("Vibecoding") menggunakan terminal/IDE dan Gemini CLI.
2.  **Visualisasi**: Pengguna melihat hasilnya di browser.
3.  **Refinement (Vibe Editor)**:
    *   Pengguna merasa ada margin yang kurang pas atau warna yang salah.
    *   Daripada menebak angka CSS di kode, pengguna menggeser elemen di **Vibe Editor**.
    *   Vibe Editor memperbarui kode secara otomatis (misal: mengubah `p-4` menjadi `p-6`).

## 3. Arsitektur Sistem: "The Vibe Editor"

Solusi yang dipilih adalah membangun aplikasi desktop/lokal ("Vibe Editor") dengan arsitektur berikut:

### 3.1 Komponen
1.  **The Engine (Backend - Node.js)**
    *   Bertugas membaca dan menulis file kode pengguna.
    *   Menggunakan **AST (Abstract Syntax Tree)** via `jscodeshift` untuk melakukan pengeditan kode yang aman dan presisi (bukan sekadar *find & replace* teks).
2.  **The Canvas (Frontend - React Overlay)**
    *   Me-render aplikasi pengguna (Next.js/Vite) dalam lingkungan terkontrol (iframe).
    *   Menyediakan lapisan UI untuk seleksi elemen, drag-and-drop, dan pengeditan properti.
3.  **The AI (Gemini Integration)**
    *   Digunakan untuk transformasi kompleks (misal: "Ubah komponen ini menjadi Card dengan gambar di kiri").

### 3.2 Stack Teknologi
*   **Target App**: Next.js (Tailwind CSS).
*   **Editor**: Electron atau Web App Lokal.
*   **Code Mod**: `jscodeshift` atau `babel`.
*   **Visual Lib**: `react-moveable` (untuk seleksi/resize), `dnd-kit`.

## 4. Status Saat Ini
*   [x] Riset Kelayakan (Selesai)
*   [x] Definisi Kasus Penggunaan (Selesai)
*   [x] Spesifikasi Arsitektur (Selesai)
*   [ ] Prototyping (Tertunda - Menunggu Diskusi)

## 5. Topik Diskusi Selanjutnya
Untuk melanjutkan, kita perlu mendalami detail teknis. Mana yang ingin kita bahas terlebih dahulu?

1.  **Strategi AST**: Bagaimana cara kita memetakan "Div yang diklik di layar" ke "Baris kode ke-45 di file Header.tsx"? (Ini tantangan teknik terbesar).
2.  **Integrasi Gemini**: Sejauh mana peran AI? Apakah hanya untuk refactoring besar, atau juga membantu penyesuaian style kecil?
3.  **UX Vibe Editor**: Bagaimana bentuk UI editornya? Apakah seperti DevTools browser, atau seperti Figma?
