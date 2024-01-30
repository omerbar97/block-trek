'use client';
import React, { useEffect }  from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Combobox } from './combobox.component'
import { DatePicker } from './date.component'
import { SearchPopover } from './searchpopover.component'
import { useSearch } from '@/hooks/searchbar.hook'
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';


const Searchbar = () => {

    const {replace} = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const params = new URLSearchParams(searchParams);

    const { input, setInput, category, setCategory, experationDate, setExperationDate } = useSearch()

    useEffect(() => {
        const input_p = params.get('query')
        const category_p = params.get('category')
        const date_p = params.get('experation')
        if (input_p) {
            setInput(input_p)
        }
        if (category_p) {
            setCategory(category_p)
        }
        if (date_p) {
            const date = new Date(date_p)
            setExperationDate(date)
        }
    }, [])

    function handleSearch() {
        
        if (input && input != "") {
            params.set('query', input);
        } else {
            params.delete('query');
        }
        if (category && category != "") {
            params.set('category', category);
        } else {
            params.delete('category')
        }
        if (experationDate && experationDate.toDateString() != "") {
            params.set('experation', experationDate.toDateString());
        } else {
            params.delete('experation')
        }
        replace(`${pathname}?${params.toString()}`);
    }


    const handleSearchLogic: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        // setting in the url
        e.preventDefault()
        handleSearch()
        //...
    }



    const searchForm = () => {
        return (
            <form className="flex flex-col md:flex-row w-full space-y-2 md:space-y-0 md:space-x-2">
                {/* Search Input */}
                <Input
                    type="text"
                    placeholder="Search campaign"
                    value={input ? input : ""}
                    className='bg-slate-200 text-black flex-grow-0 min-w-40'
                    onChange={(e) => {setInput(e.target.value)}}
                />

                {/* Combobox */}
                <Combobox />

                {/* Date Picker */}
                <DatePicker />

                {/* Search Button */}
                <Button type="submit" variant='default' className='text-black' onClick={handleSearchLogic}>
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
