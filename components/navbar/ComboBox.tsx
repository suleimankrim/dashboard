"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useModelStore } from "@/hooks/use-store-modal";
import { Store as prismaStore } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

interface ComboBoxProps {
  stores: prismaStore[];
}
export function ComboBox({ stores }: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const store = useModelStore();
  const params = useParams();
  const route = useRouter();
  const StoresPop: { value: string; label: string }[] = stores?.map(
    (store) => ({
      value: store.id,
      label: store.name,
    })
  );
  const currentStore: { value: string; label: string } = StoresPop?.find(
    (store) => store.value === params.storeId
  )!;
  function onSelectStore(store: { value: string; label: string }) {
    setOpen(false);
    route.push(`/${store.value}`);
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <Store className="h-5 w-5" />
          {currentStore.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search store..." />
          <CommandEmpty>No store found.</CommandEmpty>
          <CommandGroup>
            {StoresPop?.map((framework) => (
              <CommandItem
                key={framework.value}
                onSelect={() => {
                  onSelectStore(framework);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === framework.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {framework.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <CommandItem onSelect={store.onOpen}>
              <PlusCircle className="h-4 w-4 opacity-80 mr-3" />
              Create store
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
