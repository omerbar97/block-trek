"use client"
import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
    data: {label: string, value:string}[];
    setValue: React.Dispatch<React.SetStateAction<string | null>>
    value: string | null
    name: string
}

export const Combobox= (props: ComboboxProps) => {
    const [open, setOpen] = React.useState(false)

    const { data, setValue, value, name} = props
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='default'
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between text-black"
                >
                    {value
                        ? value
                        : `Select ${name}...`}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full h-fit-content p-0 max-h-96">
                <Command>
                    <CommandInput placeholder="Search categories..." className="h-9" />
                    <CommandEmpty>No {name} found.</CommandEmpty>
                    <CommandGroup>
                        {data && data.map((d) => (
                            <CommandItem
                                key={d.value}
                                value={d.value}
                                onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : d.label)
                                    setOpen(false)
                                }}
                            >
                                {d.label}
                                <CheckIcon
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        value === d.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
