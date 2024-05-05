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
import { dateIsNotValidToast, totalNumberOfDaysToast, totalNumberOfHoursToast } from "@/utils/toast"
import { getDaysBetweenDates, getHoursBetweenDates } from "@/utils/date"
import { SelectSingleEventHandler } from "react-day-picker"

interface DatePickerForCreationCampaignProps {
    date: Date | null,
    setDate: React.Dispatch<React.SetStateAction<Date | null>>
}


const DatePickerForCreationCampaign: React.FC<DatePickerForCreationCampaignProps> = (props: DatePickerForCreationCampaignProps) => {

    const {date, setDate} = props
    useEffect(() => {
        const todayDate = new Date()
        if (date && todayDate > date) {
            //  cannot select this
            dateIsNotValidToast()
            setDate(null)
        }
        else if (date) {
            const numOfDays = getDaysBetweenDates(todayDate, date)
            if (numOfDays <= 3) {
                // Calculating the hours
                const hours = getHoursBetweenDates(todayDate, date)
                totalNumberOfHoursToast(hours)
            } else {
                totalNumberOfDaysToast(getDaysBetweenDates(todayDate, date))
            }
        }
    }, [date])

    const handleDateSelect: SelectSingleEventHandler = (selectedDate) => {
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

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
                    selected={date ?? new Date()}
                    onSelect={handleDateSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

export default DatePickerForCreationCampaign