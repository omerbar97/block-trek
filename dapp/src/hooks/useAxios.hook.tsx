// useAxios hook
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = process.env.SITE_URL
export const useAxiosPost = ( url: string, body: any) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');
    const [loading, setloading] = useState(true);

    const fetchData = () => {
        axios.post(url, body)
            .then((res) => {
                setResponse(res.data);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setloading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refetch = () => {
        fetchData()
    }

    return { response, error, loading, refetch };
};


export const useAxiosGet = (url: string, query: Map<string, string> | null=null) => {
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState<any>('');
    const [loading, setloading] = useState<boolean>(true);

    const fetchData = (newUrl: string| null=null, query: Map<string, string> | null=null) => {
        url = newUrl ?? url
        var urlWithQuery = url
        if (query !== null) {
            const queryString = Array.from(query)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
            urlWithQuery = `${url}?${queryString}`
        }
        axios.get(urlWithQuery)
            .then((res) => {
                setResponse(res.data);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setloading(false);
            });
    };

    useEffect(() => {
        fetchData(url, query);
    }, []);

    const refetch = (newUrl: string | null=null, query: Map<string, string> | null=null) => {
        fetchData(newUrl, query)
    }

    return { response, error, loading, refetch };
};
