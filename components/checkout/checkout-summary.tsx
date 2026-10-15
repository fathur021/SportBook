
// Tipe data item sewa perlengkapan yang dipilih
export type SelectedEquipment = {
  name: string;
  qty: number;
  pricePerUnit: number;
};
type CheckoutSummaryProps = {
    venueNama:string;
    venueAddres:string;
    sportLabel:string;
    courtName:string;
    courtImage?:string;
    courtSpecs?:string[];
    maxPlayer:number;
    date:string | null;
    time:string|null;
    durationHours:number;
    pricePerHour:number;
    equipmentList?: SelectedEquipment[];
    platformFee?:number;
    promoCode?:string;
    discountAmount?:number;
}

function formatDate(dateStr:string |null){
    if(!dateStr) return "Tanggal Belum di Pilih"
    const [y,m,n] = dateStr.split("-").map(Number);
    const dateObj = new Date(y,m-1,n);
    return dateObj.toLocaleDateString("id-ID",{
        weekday:"long",
        day:"numeric",
        month:"short",
        year:"numeric"
    })
}




export function CheckoutSummary() {
    return (
        <div>
            <h1>Checkout Summary</h1>
        </div>
    )
}