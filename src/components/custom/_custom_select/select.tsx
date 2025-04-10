"use client";

import * as React from "react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Options = Record<"value" | "label", string>;

interface FancySelectProps {
  options: Options[];

  onChangeValue: React.Dispatch<React.SetStateAction<Options>>;
  placeholder?: string,
  defaultValue?: Options,
  unit?: string,
  classNameSelect?: string,
  disabled?: boolean,
  isNumber?: boolean,
  isDecimal?: boolean,
}

export function FancySelect({
  options,
  onChangeValue,
  placeholder,
  defaultValue,
  unit,
  classNameSelect,
  disabled,
  isNumber = false,
  isDecimal = false
}: FancySelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Options | undefined>(defaultValue ?? undefined);
  const [inputValue, setInputValue] = React.useState("");

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (inputValue === '') {
            setOpen(true)
          }
          setSelected(undefined)
          setInputValue("")
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    []
  );

  const filteredItems = options.filter(
    (option) => option.label.includes(inputValue.toLowerCase())
  );

  console.log(filteredItems, selected, inputValue);


  React.useEffect(() => {
    if (selected) {
      onChangeValue(selected)
    }
  }, [selected]);

  const handlerEnterNewSelect = () => {
    const value = inputRef.current?.value.trim();
    if (isNumber) {
      const numericValue = Number(value);
      if (isNaN(numericValue)) {
        return;
      }
      if (isDecimal === false && !Number.isInteger(numericValue)) {
        return
      }
    }
    if (value) {
      const newOption = {
        value: value,
        label: value,
      };
      if (options.some((selectedOption) => selectedOption.value === newOption.value)) {
        return;
      }
      options.push(newOption)
      setSelected(newOption)
      console.log(newOption)
      setOpen(false)
      setInputValue("");
    }
  };

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2.5 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected?.value ? `${selected?.label} ${unit ?? ""}` : ""}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            disabled={disabled}
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation(); 
                handlerEnterNewSelect();
              }
            }}
            placeholder={selected?.value ? '' : placeholder ?? "Select options..."}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && filteredItems.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className={cn("max-h-60 overflow-y-auto", classNameSelect)}>
                {filteredItems.map((item) => {
                  return (
                    <CommandItem
                      key={item.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue("");
                        setSelected(item)
                        setOpen(false)
                      }}
                      className={"cursor-pointer"}
                    >
                      {item.label} {unit ?? ""}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
