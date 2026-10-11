import { getTimeSlotBands, TimeSlotOption } from "@/lib/time-slots"
import { useState } from "react";
import { Card } from "../ui/card";

type SelecTimeProp = {
    slots : TimeSlotOption[];
    pricePerHour:number;
}


export  function SelctTimeSlot ({slots, pricePerHour}:SelecTimeProp) {
    const [value, setValue] = useState<string | null>(null);
    const bands = getTimeSlotBands(slots)
    return (
        <Card>
            <p>Step 2</p>
            <h2>SelecTimeSlot</h2>
        </Card>
    )
}