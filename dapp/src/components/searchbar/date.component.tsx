"use client"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useSearch } from "@/hooks/searchbar.hook"
import { useEffect, useState } from "react"

export function DatePicker() {

    const { experationDate, setExperationDate } = useSearch()

    const [date, setDate] = useState<Date>()
    
    useEffect(() => {
        if (date) {
            setExperationDate(date)
        }
    }, [date])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="default"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 text-black" />
                    {date ? <span className="text-black">{format(date, "PPP")}</span> : <span className="text-black">Experation until..</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
