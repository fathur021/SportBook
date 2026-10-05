"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarDays, Clock, MapPin, Search, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cityOptions, sportOptions, timeOptions } from "@/lib/filters";

type FieldProps = {
  id: string;
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
};

function Field({ id, label, icon: Icon, children }: FieldProps) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <Label
        htmlFor={id}
        className="text-[11px] font-medium text-muted-foreground"
      >
        <Icon className="size-3.5" />
        {label}
      </Label>
      {children}
    </div>
  );
}

const triggerClass = "h-10 w-full border-0 bg-slate-50 text-sm shadow-none";

export function CourtSearchForm() {
  const router = useRouter();

  const [sport, setSport] = useState("padel");
  const [city, setCity] = useState("south-jakarta");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("evening");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams({ sport, city, time });
    if (date) params.set("date", format(date, "yyyy-MM-dd"));
    router.push(`/explore?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-md md:flex-row md:items-end"
    >
      <Field id="sport" label="Sport Discipline" icon={Trophy}>
        <Select value={sport} onValueChange={(v) => setSport(v ?? "")}>
          <SelectTrigger id="sport" className={triggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sportOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field id="city" label="City / District" icon={MapPin}>
        <Select value={city} onValueChange={(v) => setCity(v ?? "")}>
          <SelectTrigger id="city" className={triggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cityOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field id="date" label="Play Date" icon={CalendarDays}>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                id="date"
                type="button"
                variant="ghost"
                className="h-10 w-full justify-between bg-slate-50 px-3 text-sm font-normal"
              >
                {date ? format(date, "EEE, dd MMM yyyy") : "Pick a date"}
                <CalendarDays className="size-4 text-muted-foreground" />
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(d) => d < today}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </Field>

      <Field id="time" label="Preferred Time" icon={Clock}>
        <Select value={time} onValueChange={(v) => setTime(v ?? "")}>
          <SelectTrigger id="time" className={triggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Button type="submit" className="h-10 bg-emerald-700 hover:bg-emerald-800">
        <Search className="size-4" />
        Search Courts
      </Button>
    </form>
  );
}