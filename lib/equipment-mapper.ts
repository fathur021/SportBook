import type { EquipmentItem } from "./equipment";

// Bentuk baris equipment yang datang dari database.
type EquipmentRow = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string | null;
};

// Ubah satu baris equipment database menjadi bentuk yang dipakai
// komponen booking (EquipmentPicker, ringkasan, dan checkout).
export function toEquipmentItem(row: EquipmentRow): EquipmentItem {
  return {
    id: row.id,
    name: row.name,
    description: row.category ?? undefined,
    pricePerUnit: row.price,
    unit: `Stok tersedia: ${row.stock}`,
  };
}

export function toEquipmentItems(rows: EquipmentRow[]): EquipmentItem[] {
  return rows.map(toEquipmentItem);
}
