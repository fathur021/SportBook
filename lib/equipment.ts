// Tipe equipment yang dipakai komponen booking.
// Data equipment sekarang diambil dari database lewat equipment-mapper.ts.
export type EquipmentItem = {
  id: string;
  name: string;
  description?: string;
  pricePerUnit: number;
  unit?: string;
};
