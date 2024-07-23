import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectScrollableProps {
    className?: string;
    data: {label: string, value: string}[];
    setValue: React.Dispatch<React.SetStateAction<String | null>>
    placeholder: string
}

const SelectScrollable: React.FC<SelectScrollableProps> = (props: SelectScrollableProps) => {

  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
        {props.data.map((v) => (
            <SelectItem key={v.value} value={v.value}>
                {v.label}
            </SelectItem>     
        ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectScrollable;
