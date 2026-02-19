# UX/UI Design: Vibe Canvas

## 1. Filosofi Desain
Vibe Editor dirancang agar **"Invisible yet Powerful"**. Antarmuka harus minimalis agar pengguna fokus pada aplikasi mereka, tetapi muncul dengan alat yang lengkap saat dibutuhkan.
Gaya visual: Mirip dengan *Figma* atau *Vercel Toolbar*.

## 2. Tata Letak (Layout)

### 2.1 The Stage (Center)
*   **Iframe Sandbox**: Memuat aplikasi pengguna (Next.js/Vite) secara penuh.
*   **Overlay Layer**: `div` transparan di atas iframe yang menangkap event mouse (hover, click) dan menggambar garis seleksi (mirip Inspect Element di browser).

### 2.2 The Toolbar (Bottom/Top Floating)
*   **Alat Utama**:
    *   `Cursor` (Select mode).
    *   `Hand` (Pan/Interact mode).
    *   `Freeform` (Ungroup/Absolute mode).
    *   `AI Star` (Buka Prompt Box).
*   **Action Buttons**:
    *   `Vibeify` (Magic Clean Up): Tombol untuk merapikan layout Freeform menjadi Flexbox/Grid.
*   **Breadcrumbs**: Menampilkan hierarki komponen saat ini (misal: `App > Dashboard > Sidebar > Button`).

### 2.3 The Inspector (Right Sidebar)
Muncul saat elemen dipilih.
*   **Tab Style**: Editor visual untuk Tailwind classes.
    *   *Typography*: Font, Size, Weight.
    *   *Spacing*: Margin/Padding visualizer.
    *   *Colors*: Background, Text, Border picker.
*   **Tab Props**: Daftar props komponen React yang terdeteksi (via AST).
    *   Input teks untuk string props.
    *   Toggle untuk boolean props.

### 2.4 The Terminal (Bottom Panel)
*   Collapsible panel di bagian bawah layar.
*   Emulator terminal xterm.js standar.
*   Fokus utama: Menjalankan `gemini refactor`, `gemini chat`, atau script setup.

### 2.5 The AI Command (Floating Modal - Cmd+K)
*   Input teks besar di tengah layar.
*   Konteks yang ditampilkan: "Editing `<Sidebar />`".
*   Tombol: "Generate Theme", "Refactor", "Fix UI".

## 3. Interaksi (Micro-interactions)

### 3.1 Seleksi & Hover
*   **Hover**: Border biru tipis di sekitar elemen DOM. Label nama komponen muncul di pojok kiri atas elemen (misal: `Header.tsx`).
*   **Click**: Border biru tebal. Sidebar Properti terbuka.

### 3.2 Direct Manipulation
*   **Text Edit**: Double click pada teks apapun untuk mengubah kontennya langsung (`contentEditable`).
*   **Margin/Padding**: Drag handle di sisi elemen untuk menambah/mengurangi spacing secara visual (mengupdate class `p-4` ke `p-6` dst).

## 4. Visual Mockup (Deskripsi)
```
+-------------------------------------------------------+
|  [Toolbar: Select | Hand | AI ]           [Run App]   |
+-------------------------------------------------------+
|                                                       |
|  +---------------------------+  +------------------+  |
|  |                           |  |  Inspector       |  |
|  |   [ Iframe: User App ]    |  |                  |  |
|  |   +-------------------+   |  |  Component: Card |  |
|  |   | [Selection Box]   |   |  |                  |  |
|  |   | Title             |   |  |  [Style] [Props] |  |
|  |   +-------------------+   |  |                  |  |
|  |                           |  |  Bg: [ #FFFFFF ] |  |
|  |                           |  |  P : [ 16px    ] |  |
|  |                           |  |                  |  |
|  +---------------------------+  +------------------+  |
|                                                       |
+-------------------------------------------------------+
```
