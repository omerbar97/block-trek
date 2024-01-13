import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Combobox } from './combobox.component'
import { DatePicker } from './date.component'
import { SearchPopover } from './searchpopover.component'

const Searchbar = () => {

    const searchForm = () => {
        return (
            <form className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                {/* Search Input */}
                <Input
                    type="text"
                    placeholder="Search campaign"
                    className='bg-slate-200 text-black flex-grow-0 min-w-40'
                />

                {/* Combobox */}
                <Combobox />

                {/* Date Picker */}
                <DatePicker />

                {/* Search Button */}
                <Button type="submit" variant='outline' className='text-black'>
                    Search
                </Button>
            </form>
        )
    }

    return (
        <>
            <div className='hidden md:block w-full'>
                {searchForm()}
            </div>
            <div className='md:hidden'>
                <SearchPopover>
                    {searchForm()}
                </SearchPopover>
            </div>
        </>
    )
}

export default Searchbar
