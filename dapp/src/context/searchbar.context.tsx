import { createContext } from 'react';

interface SearchbarContextProps {
    input: string | null;
    setInput: React.Dispatch<React.SetStateAction<string | null>>
    category: string | null;
    setCategory: React.Dispatch<React.SetStateAction<string | null>>;
    experationDate: Date | null;
    setExperationDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const SearchBarContext = createContext<SearchbarContextProps | null>(null);

export { SearchBarContext };
