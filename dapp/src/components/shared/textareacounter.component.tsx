'use client';
import React, { useState } from 'react'
import { Textarea } from '../ui/textarea';

interface TextareaProps {
    description: string,
    placeholder: string
}

const TextareaCounter : React.FC<TextareaProps> = ({description, placeholder}) => {

    const max_words = 500
    const [words, setWords] = useState<number>(0)

    const handleCount = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputText = e.target.value.trim();
        const wordsArray = inputText.split(' ');
    
        if (inputText === "") {
            setWords(0);
        } else if (wordsArray.length <= max_words) {
            setWords(wordsArray.length);
        } else {
            // Truncate the text to max_words words
            const truncatedText = wordsArray.slice(0, max_words).join(' ');
            e.target.value = truncatedText;
            setWords(max_words);
        }
    }

    return (
        <label
            htmlFor="campaign_description"
            className="block text-sm font-medium leading-6 text-gray-900"
        >
            {description}
            <Textarea onChange={handleCount} placeholder={placeholder} id='campaign_description' className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'></Textarea>
            <p>Words {words}/{max_words}</p>
        </label>
    )
}

export default TextareaCounter