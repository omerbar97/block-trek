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
import { SearchBarCategories } from "@/constants/combobox.constant"
import { useSearch } from "@/hooks/searchbar.hook"

export function Combobox({className} : {className: string}) {
    const [open, setOpen] = React.useState(false)

    const { category, setCategory } = useSearch()

    return (
        <Popover open={open} onOpenChange={setOpen} className={className}>
            <PopoverTrigger asChild>
                <Button
                    variant='default'
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between text-black"
                >
                    {category
                        ? category
                        : "Select category..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full h-96 p-0">
                <Command>
                    <CommandInput placeholder="Search categories..." className="h-9" />
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                        {SearchBarCategories.map((catagory) => (
                            <CommandItem
                                key={catagory.value}
                                value={catagory.value}
                                onSelect={(currentValue) => {
                                    setCategory(currentValue === category ? "" : catagory.label)
                                    setOpen(false)
                                }}
                            >
                                {catagory.label}
                                <CheckIcon
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        category === catagory.value ? "opacity-100" : "opacity-0"
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
