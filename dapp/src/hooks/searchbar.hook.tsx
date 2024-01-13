import React, { useState, useContext, ReactNode } from "react";
import { SearchBarContext } from "@/context/searchbar.context";

interface SearchBarContextChildren {
  children: ReactNode;
}

export const SearchbarProvider: React.FC<SearchBarContextChildren> = ({ children }) => {
  const [input, setInput] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>("");
  const [experationDate, setExperationDate] = useState<Date | null>(null)

  const contextValue = {
    input,
    setInput,
    category,
    setCategory,
    experationDate,
    setExperationDate
  };

  return (
    <SearchBarContext.Provider value={contextValue} >{children}</SearchBarContext.Provider>
  )

};

export const useSearch = () => {
  const context = useContext(SearchBarContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchBarProvider");
  }
  return context;
};

