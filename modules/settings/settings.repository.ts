import { prisma } from "@/lib/prisma";

import type { UpdateSettingsInput } from "./settings.schema";
const SETTING_ID = "global";

//Membaca setting
export function findOrCreateSettings(){
    //upsert = update kalau ada, dan create kalau belum ada
    return prisma.setting.upsert({
        //selelu menjutu baris yang sama
        where: {id:SETTING_ID},
        create: {id:SETTING_ID},
        update: {}
        
    })
}

//menyimpan perubahan
export function updateSettings(data:UpdateSettingsInput){
    return prisma.setting.upsert({
        //selalu menuju baris yang sama
        where: {id:SETTING_ID},
        //kalu belum ada, buat sekaligus isi data nya
        create:{id:SETTING_ID,...data},
        //kalay sudah ada, ubah filed yang dikirim saja
        update:data
    })
}
