import { Button } from "@/components/ui/button"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ReactNode } from "react"

export function SearchPopover({ children }: { children: ReactNode }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant='default' className="text-black">open search options</Button>
            </PopoverTrigger>
            <PopoverContent className="w-full">
                {children}
            </PopoverContent>
        </Popover>
    )
}
