# Technical Design: AST Manager (The Vibe Engine)

## 1. Tujuan
Komponen ini bertanggung jawab untuk membaca kode sumber React, memahaminya sebagai struktur pohon (AST), dan melakukan modifikasi presisi berdasarkan instruksi dari UI Editor, tanpa merusak format atau logika kode yang ada.

## 2. Tantangan Utama
1.  **Identifikasi Lokasi**: Bagaimana mengetahui bahwa `<div className="p-4">` di browser berkorespondensi dengan baris 42 di `Header.tsx`?
2.  **Preservasi Kode**: Saat mengedit satu prop, kita tidak boleh menghilangkan komentar, format, atau kode lain di file tersebut.
3.  **Dinamis vs Statis**: Bagaimana menangani prop yang berupa variabel (misal: `className={active ? 'bg-red' : 'bg-blue'}`)?

## 3. Strategi Identifikasi (The "Vibe ID")
Untuk menghubungkan DOM di browser dengan AST, kita memerlukan mekanisme pelacakan.

### Pendekatan: Data Attribute Injection (Development Only)
Saat fase *development*, kita akan menyuntikkan atribut `data-vibe-id` ke setiap elemen JSX.

**Sebelum (Source Code):**
```tsx
<button className="btn">Click me</button>
```

**Sesudah (Inject via Babel Plugin saat compile):**
```tsx
<button className="btn" data-vibe-id="Header.tsx:42:5">Click me</button>
```

*   `data-vibe-id` berisi: `[FilePath]:[LineNumber]:[ColumnNumber]`.
*   Saat pengguna mengklik elemen di "Vibe Canvas", kita membaca ID ini.

## 4. Alur Kerja Modifikasi (The Workflow)

1.  **User Action**: Pengguna mengubah background color menjadi merah di Vibe Editor.
2.  **Request**: Editor mengirim JSON ke AST Manager:
    ```json
    {
      "file": "src/components/Header.tsx",
      "location": { "line": 42, "column": 5 },
      "operation": "update_prop",
      "prop": "className",
      "value": "bg-red-500" // Tailwind class
    }
    ```
3.  **AST Transformation (jscodeshift)**:
    *   Baca file `src/components/Header.tsx`.
    *   Parse menjadi AST.
    *   Cari `JSXOpeningElement` yang berada di posisi baris 42, kolom 5.
    *   Cari atribut `className`.
    *   Jika ada, *append* atau *replace* string value-nya.
    *   Jika tidak ada, buat atribut baru.
4.  **Write**: Tulis kembali kode ke disk.
5.  **HMR**: Next.js HMR mendeteksi perubahan dan me-refresh browser.

## 5. Implementasi (Pseudocode jscodeshift)

```typescript
export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Cari elemen berdasarkan lokasi baris/kolom
  root.find(j.JSXOpeningElement).forEach(path => {
    const { line, column } = path.node.loc.start;
    if (line === TARGET_LINE && column === TARGET_COLUMN) {
       
       // Update className
       const classAttr = path.node.attributes.find(
         attr => attr.name.name === 'className'
       );
       
       if (classAttr) {
         // Logika penggabungan class tailwind bisa ditaruh di sini
         classAttr.value.value = NEW_CLASS_VALUE;
       }
    }
  });

  return root.toSource();
}
```

## 6. Batasan (Scope untuk Prototipe)
Untuk fase awal (prototipe), kita akan membatasi pada:
*   Hanya mengedit **Statis Props** (String literal).
*   Belum menangani *Conditional Logic* (Ternary operators).
*   Fokus pada **Tailwind CSS classes** terlebih dahulu.
