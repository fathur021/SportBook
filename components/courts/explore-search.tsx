"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ExploreSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const currentQuery = params.get("q") ?? "";
  const [value, setValue] = useState(currentQuery);

  useEffect(() => {
    setValue(currentQuery);
  }, [currentQuery]);

  const pushQuery = (keyword: string) => {
    const next = new URLSearchParams(params.toString());

    if (keyword) next.set("q", keyword);
    else next.delete("q");

    // Reset pagination supaya tidak terjebak di halaman kosong.
    next.delete("page");

    const queryString = next.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        pushQuery(value.trim());
      }}
      className="flex w-full max-w-md gap-2"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Cari nama venue atau area..."
          className="pl-9"
          aria-label="Cari venue"
        />
      </div>

      <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800">
        <Search data-icon="inline-start" />
        Cari
      </Button>

      {currentQuery && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 shrink-0"
          aria-label="Hapus pencarian"
          onClick={() => {
            setValue("");
            pushQuery("");
          }}
        >
          <X className="size-4" />
        </Button>
      )}
    </form>
  );
}
