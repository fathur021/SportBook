export const LOCALE = "id-ID";
export const BUSINESS_TIME_ZONE = "Asia/Jakarta";

//pla tanggal
const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export type DateStyle =
  | "dayMonth" // constoh 22| "dayMonth" // Contoh: "22 Nov"
  | "monthDay" // Contoh: "Nov 22"
  | "short" // Contoh: "22 Nov 2026"
  | "long" // Contoh: "22 November 2026"
  | "weekdayShort" // Contoh: "Min"
  | "weekdayLongShortMonth" // Contoh: "Minggu, 22 Nov 2026"
  | "weekdayLongFullMonth"; // Contoh: "Minggu, 22 November 2026"

export type DateTimeStyle =
  | "short" // contoh "22 nov 2026 19.30"
  | "long" // contoh "Minggu 22 Novermber 2026, 19.30"
  | "timeOnly"; // contoh: "19.30"

const DATE_STYLES: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  //daftar pola tampilan untuk tanggal murni

  //tanggal + bulan singkat
  dayMonth: { day: "numeric", month: "short" },
  //bulan singkat + tanggal
  monthDay: { month: "short", day: "numeric" },
  //tanggal paling umum di tabel
  short: { day: "numeric", month: "short", year: "numeric" },
  //nama bulang lengkap
  long: { day: "numeric", month: "long", year: "numeric" },
  //nama hari songkat saja
  weekdayShort: { weekday: "short" },
  weekdayLongShortMonth: {
    //nama hari lengkap dengan bulan singkat
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  },
  weekdayLongFullMonth: {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  },
};

const DATA_TIME_STYLE: Record<DateTimeStyle, Intl.DateTimeFormatOptions> = {
  // Daftar pola tampilan untuk membuat tanggal yang sudah ada jam nya
  short: {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  },
  long: {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  },
  timeOnly: {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  },
};

const dateFormatters = new Map<DateStyle, Intl.DateTimeFormat>();
const dateTimeFormatters = new Map<DateTimeStyle, Intl.DateTimeFormat>();

const dateKeyFormatter = new Intl.DateTimeFormat("en-Us", {
  timeZone: BUSINESS_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const numberFormatter = new Intl.NumberFormat(LOCALE, {
  maximumFractionDigits: 2,
});

function getDateFormatter(style:DateStyle){
    let formatter = dateFormatters.get(style);
    if(!formatter){
        formatter = new Intl.DateTimeFormat(LOCALE,{
            ...DATE_STYLES[style],
            timeZone:"UTC",
        });
        dateFormatters.set(style,formatter)
    }
    return formatter;
}
function getDateTimeFormatter(style:DateTimeStyle){
    let formatter = dateTimeFormatters.get(style);
    if(!formatter){
        formatter = new Intl.DateTimeFormat(LOCALE,{
            ...DATA_TIME_STYLE[style],
            timeZone:BUSINESS_TIME_ZONE
        });
        dateTimeFormatters.set(style,formatter);
    }
    return formatter;
}
function getPart(parts:Intl.DateTimeFormatPart[],type:string){
    return parts.find((part)=>part.type === type )?.value;
}

export function toDateKey(date:Date = new Date()):string{
    if(Number.isNaN(date.getTime())) return "";

    const parts = dateKeyFormatter.formatToParts(date);
    const year = getPart(parts,"year");
    const month = getPart(parts,"month");
    const day = getPart(parts,"day");

    if(!year || !month || !day) return "";

    return `${year}-${month}-${day}`;
}