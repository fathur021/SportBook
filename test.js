// ===================================================================
// FITUR HARD DELETE EQUIPMENT — HAPUS DATA SEBENARNYA
// ===================================================================
// Perbedaan Soft Delete vs Hard Delete:
//   - Soft Delete: Data tidak dihapus, hanya ditandai isActive=false
//   - Hard Delete: Data benar-benar dihapus dari database (DELETE FROM)
//
// Saat ini: DELETE endpoint melakukan SOFT DELETE (deactivate)
// Yang diinginkan: HARD DELETE (hapus permanen)
//
// File yang perlu diubah:
//   1. Repository: modules/equipment/equipment.repository.ts
//   2. Service: modules/equipment/equipment.service.ts
//   3. Controller: modules/equipment/equipment.controller.ts
//   4. API Route: app/api/admin/equipments/[equipmentId]/route.ts
//   5. Frontend: components/admin/Equipment-row-actions.tsx
// ===================================================================

// ============================================
// ANALOGI: SAMPAH
// ============================================

/*
Soft Delete vs Hard Delete:

Soft Delete (seperti saat ini):
- Seperti memindahkan file ke "Recycle Bin"
- File masih ada, hanya disembunyikan
- Bisa dipulihkan kapan saja

Hard Delete (yang diinginkan):
- Seperti menghapus file dengan "Shift + Delete"
- File benar-benar hilang, tidak bisa dipulihkan
- Perlu konfirmasi ekstra karena permanen
*/

// ============================================
// LAYER 1: REPOSITORY (Akses Database)
// ============================================
// File: modules/equipment/equipment.repository.ts
// Tugas: Berbicara langsung dengan database via Prisma

// [~] EDIT — Tambahkan fungsi baru setelah fungsi deactivateEquipmentById
// Letakkan di baris 86 (setelah fungsi deactivateEquipmentById)

export function deleteEquipmentById(id: string) {
  // ← fungsi untuk menghapus equipment secara permanen
  return prisma.equipment.delete({
    where: { id },                    // ← cari equipment dengan ID ini
    // ← prisma.equipment.delete() akan menjalankan SQL:
    //    DELETE FROM Equipment WHERE id = ?
  });
  // ← ini adalah "hard delete" — data benar-benar dihapus dari database
  // ← karena relasi BookingEquipment menggunakan onDelete: SetNull,
  //    equipmentId di BookingEquipment akan di-set ke null otomatis
}

// Penjelasan:
// - prisma.equipment.delete() = hard delete, hapus baris dari tabel
// - prisma.equipment.update() = soft delete, hanya ubah data
// - Tidak perlu select karena data sudah dihapus, tidak ada yang dikembalikan

// ============================================
// LAYER 2: SERVICE (Logika Bisnis)
// ============================================
// File: modules/equipment/equipment.service.ts
// Tugas: Mengelola logika bisnis dan error handling

// [+] TAMBAHKAN — Import fungsi baru dari repository
// Di bagian atas file, tambahkan ke import yang sudah ada:

import {
  createEquipment,
  deactivateEquipmentById,
  deleteEquipmentById,        // [+] TAMBAHKAN baris ini
  findEquipmentCountsByVenueIds,
  findEquipmentsByVenueId,
  findVenueBySlug,
  updateEquipmentById,
  findActiveEquipmentsByVenueId
} from "./equipment.repository";

// [+] TAMBAHKAN — Fungsi service baru setelah deactivateEquipmentService
// Letakkan di baris 124 (setelah fungsi deactivateEquipmentService)

export async function deleteEquipmentService(equipmentId: string) {
  // ← fungsi service untuk menghapus equipment secara permanen
  try {
    // Panggil repository untuk hapus dari database
    return await deleteEquipmentById(equipmentId);
  } catch (error) {
    // ← tangkap error dari repository
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"          // ← kode error: data tidak ditemukan
    ) {
      // Jika equipment tidak ada, lempar error yang lebih deskriptif
      throw new EquipmentNotFoundError();
    }
    throw error; // ← jika error lain, lempar lagi ke layer atas
  }
}

// Penjelasan:
// - Struktur sama dengan deactivateEquipmentService
// - Bedanya: memanggil deleteEquipmentById, bukan deactivateEquipmentById
// - Error handling tetap sama: P2025 = data tidak ditemukan

// ============================================
// LAYER 3: CONTROLLER (Handle HTTP Request)
// ============================================
// File: modules/equipment/equipment.controller.ts
// Tugas: Menerima request HTTP, validasi, dan memanggil service

// [+] TAMBAHKAN — Import fungsi baru dari service
// Di bagian atas file, tambahkan ke import yang sudah ada:

import {
  EquipmentNameConflictError,
  EquipmentNotFoundError,
  createEquipmentService,
  deactivateEquipmentService,
  deleteEquipmentService,       // [+] TAMBAHKAN baris ini
  listEquipmentsByVenueSlugService,
  updateEquipmentService,
} from "./equipment.service";

// [+] TAMBAHKAN — Fungsi controller baru setelah deactivateEquipmentController
// Letakkan di baris 209 (setelah fungsi deactivateEquipmentController)

export async function deleteEquipmentController(
  request: Request,                   // ← request HTTP dari client
  rawEquipmentId: string,             // ← ID equipment dari URL
): Promise<Response> {                // ← mengembalikan response HTTP
  try {
    // 1. Cek apakah user adalah admin
    const authorization = await requireAdmin(request);
    if (!authorization.ok) {
      // ← jika bukan admin, tolak akses
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }

    // 2. Validasi ID equipment
    const idResult = equipmentIdSchema.safeParse(rawEquipmentId);
    if (!idResult.success) {
      // ← jika ID tidak valid, kembalikan error
      return Response.json(
        { error: "ID peralatan tidak valid" },
        { status: 400 },
      );
    }

    // 3. Panggil service untuk proses delete permanen
    await deleteEquipmentService(idResult.data);

    // 4. Kembalikan hasil ke client
    return Response.json({ success: true });
  } catch (error) {
    // ← tangkap error dari service
    if (error instanceof EquipmentNotFoundError) {
      // ← jika equipment tidak ditemukan
      return Response.json({ error: error.message }, { status: 404 });
    }

    // Error lain — server error
    console.error("Gagal menghapus peralatan:", error);
    return Response.json(
      { error: "Gagal menghapus peralatan" },
      { status: 500 },
    );
  }
}

// Penjelasan:
// - Struktur sama dengan deactivateEquipmentController
// - Bedanya: memanggil deleteEquipmentService, bukan deactivateEquipmentService
// - Return { success: true } karena data sudah dihapus, tidak ada yang dikembalikan
// - requireAdmin memastikan hanya admin yang bisa delete
// - equipmentIdSchema memvalidasi format ID menggunakan Zod

// ============================================
// LAYER 4: API ROUTE (Endpoint HTTP)
// ============================================
// File: app/api/admin/equipments/[equipmentId]/route.ts
// Tugas: Menentukan method HTTP (GET, POST, PATCH, DELETE)

// [~] EDIT — Ubah fungsi DELETE agar memanggil controller hard delete
// Di bagian atas file, tambahkan import yang baru:

import {
  deactivateEquipmentController,
  deleteEquipmentController,    // [+] TAMBAHKAN baris ini
  updateEquipmentController,
} from "@/modules/equipment/equipment.controller";

// [~] EDIT — Ubah fungsi DELETE agar memanggil deleteEquipmentController
// Baris 14-19

export async function DELETE(
  request: Request,                   // ← request HTTP
  { params }: { params: Promise<{ equipmentId: string }> },  // ← parameter dari URL
): Promise<Response> {
  const { equipmentId } = await params;  // ← ambil ID dari URL
  // [-] HAPUS baris lama:
  // return deactivateEquipmentController(request, equipmentId);
  
  // [+] GANTI dengan baris baru:
  return deleteEquipmentController(request, equipmentId);
  // ← serahkan ke controller hard delete untuk diproses
}

// Penjelasan:
// - API Route adalah "alamat" yang bisa diakses dari browser
// - URL-nya: /api/admin/equipments/{id}
// - Method DELETE memicu fungsi ini
// - [equipmentId] di nama folder berarti ID adalah parameter dinamis
// - Route hanya mengarahkan request ke controller, tidak ada logika

// ============================================
// LAYER 5: FRONTEND (Tampilan User)
// ============================================
// File: components/admin/Equipment-row-actions.tsx
// Tugas: Tampilan dan interaksi user

// [+] YANG PERLU DITAMBAHKAN — Kode frontend untuk tombol delete

// 1. Import yang dibutuhkan
import { Trash2 } from "lucide-react"; // ← ikon tempat sampah

// 2. Fungsi handle delete di dalam komponen
async function handleDelete() {
  // ← fungsi yang dijalankan saat tombol delete diklik

  // Tampilkan konfirmasi ke user (2x konfirmasi karena hard delete)
  if (!confirm(`Yakin ingin menghapus "${item.name}" secara permanen?`)) return;
  if (!confirm(`PERINGATAN: Tindakan ini tidak bisa dibatalkan!`)) return;
  // ← jika user klik "Batal", fungsi berhenti

  setLoading(true); // ← tampilkan state loading
  try {
    // Kirim request DELETE ke API route
    const res = await fetch(`/api/admin/equipments/${item.id}`, {
      method: "DELETE",              // ← method HTTP DELETE
      credentials: "include",        // ← kirim cookie untuk autentikasi
    });

    if (!res.ok) {
      // ← jika API mengembalikan error
      const error = await res.json();
      alert(error.error || "Gagal menghapus equipment");
      return;
    }

    // Jika berhasil, refresh data tabel
    router.refresh(); // ← perbarui data tanpa reload halaman
  } catch (err) {
    console.error("Gagal menghapus equipment:", err);
    alert("Terjadi kesalahan saat menghapus equipment");
  } finally {
    setLoading(false); // ← matikan loading
  }
}

// 3. Tombol delete di JSX (return)
<Button
  variant="ghost"                     // ← gaya tombol transparan
  size="sm"                           // ← ukuran kecil
  onClick={handleDelete}              // ← saat diklik, jalankan handleDelete
  disabled={loading}                  // ← disable saat proses
  className="text-destructive hover:text-destructive hover:bg-destructive/10"
  // ← warna merah untuk menandakan aksi berbahaya
>
  <Trash2 data-icon="inline-start" size={14} /> {/* ← ikon */}
  Hapus
</Button>

// ===================================================================
// CONTOH STRUKTUR LENGKAP SETELAH DITAMBAHKAN
// ===================================================================

/*
export function EquipmentRowActions({ item }: { item: EquipmentItem }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(item.isActive);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // ... kode edit yang sudah ada ...
  }

  async function handleToggle() {
    // ... kode toggle yang sudah ada ...
  }

  // [+] TAMBAHKAN fungsi ini
  async function handleDelete() {
    if (!confirm(`Yakin ingin menghapus "${item.name}" secara permanen?`)) return;
    if (!confirm(`PERINGATAN: Tindakan ini tidak bisa dibatalkan!`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/equipments/${item.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Gagal menghapus equipment");
        return;
      }
      router.refresh();
    } catch (err) {
      console.error("Gagal menghapus equipment:", err);
      alert("Terjadi kesalahan saat menghapus equipment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      {/* Dialog Edit - sudah ada *}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="...">
          <Pencil data-icon="inline-start" size={14} />
          Edit
        </DialogTrigger>
        <DialogContent>
          {/* ... form edit ... *}
        </DialogContent>
      </Dialog>

      {/* Switch Toggle - sudah ada *}
      <Switch
        checked={active}
        onCheckedChange={handleToggle}
        size="sm"
        disabled={loading}
      />

      {/* [+] TAMBAHKAN tombol delete ini */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={loading}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 data-icon="inline-start" size={14} />
        Hapus
      </Button>
    </div>
  );
}
*/

// ===================================================================
// ALUR LENGKAP HARD DELETE — DARI KLIK SAMPAI DATABASE
// ===================================================================

/*
1. USER klik tombol "Hapus" di tabel
   ↓
2. FRONTEND (handleDelete) tampilkan konfirmasi pertama
   "Yakin ingin menghapus X secara permanen?"
   ↓
3. USER klik "OK"
   ↓
4. FRONTEND tampilkan konfirmasi kedua (PERINGATAN)
   "PERINGATAN: Tindakan ini tidak bisa dibatalkan!"
   ↓
5. USER klik "OK" lagi
   ↓
6. FRONTEND kirim request DELETE ke /api/admin/equipments/{id}
   ↓
7. API ROUTE (DELETE function) terima request
   ↓
8. API ROUTE serahkan ke deleteEquipmentController
   ↓
9. CONTROLLER cek: apakah user admin? → requireAdmin()
   ↓
10. CONTROLLER validasi: apakah ID valid? → equipmentIdSchema
    ↓
11. CONTROLLER panggil deleteEquipmentService
    ↓
12. SERVICE panggil deleteEquipmentById (repository)
    ↓
13. REPOSITORY eksekusi query: DELETE FROM Equipment WHERE id=?
    ↓
14. Database menghapus baris secara permanen
    ↓
15. Relasi BookingEquipment: equipmentId di-set ke null otomatis
    ↓
16. SERVICE kembalikan hasil ke CONTROLLER
    ↓
17. CONTROLLER kembalikan response JSON ke API ROUTE
    ↓
18. API ROUTE kembalikan response ke FRONTEND
    ↓
19. FRONTEND terima response, jalankan router.refresh()
    ↓
20. Tabel diperbarui, equipment yang dihapus hilang permanen
*/

// ===================================================================
// KUNCI PENANDA
// ===================================================================

/*
[+]  = Kode yang perlu ditambahkan (belum ada)
[~]  = Kode yang perlu diedit (sudah ada, perlu diubah)
[-]  = Kode yang perlu dihapus
[✓]  = Kode yang sudah ada dan lengkap
←    = Penjelasan singkat di sebelah kode
*/

// ===================================================================
// RINGKASAN — FILE YANG PERLU DIUBAH
// ===================================================================

/*
1. modules/equipment/equipment.repository.ts
   [+] Tambah: deleteEquipmentById() — query hard delete

2. modules/equipment/equipment.service.ts
   [+] Tambah: import deleteEquipmentById
   [+] Tambah: deleteEquipmentService() — logika bisnis

3. modules/equipment/equipment.controller.ts
   [+] Tambah: import deleteEquipmentService
   [+] Tambah: deleteEquipmentController() — handle HTTP

4. app/api/admin/equipments/[equipmentId]/route.ts
   [+] Tambah: import deleteEquipmentController
   [~] Ubah: DELETE function panggil deleteEquipmentController

5. components/admin/Equipment-row-actions.tsx
   [+] Tambah: import Trash2 icon
   [+] Tambah: handleDelete() — fungsi frontend
   [+] Tambah: <Button>Hapus</Button> — tombol di JSX
*/

// ===================================================================
// CATATAN PENTING
// ===================================================================

/*
1. Hard Delete vs Soft Delete:
   - Hard Delete: Data benar-benar dihapus, tidak bisa dipulihkan
   - Soft Delete: Data hanya ditandai isActive=false, bisa dipulihkan
   - Kode ini menggunakan HARD DELETE sesuai permintaan

2. Konfirmasi Ganda:
   - Karena hard delete bersifat permanen, frontend menggunakan
     2x konfirmasi untuk mencegah user tidak sengaja menghapus data

3. Keamanan:
   - requireAdmin() memastikan hanya admin yang bisa delete
   - equipmentIdSchema memvalidasi format ID
   - Credentials: "include" mengirim cookie autentikasi

4. Relasi Database:
   - BookingEquipment menggunakan onDelete: SetNull
   - Saat equipment dihapus, equipmentId di BookingEquipment
     akan di-set ke null otomatis oleh database

5. Error Handling:
   - Setiap layer punya try-catch sendiri
   - Error ditangani di layer yang sesuai
   - User dapat pesan error yang jelas, bukan kode teknis
*/
