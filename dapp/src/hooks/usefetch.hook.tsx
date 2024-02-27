import { useState, useEffect } from 'react';
import axios from 'axios';

// Custom hook for making GET requests
export function useGet(url: string) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(url);
                setData(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Cleanup function to abort the fetch if component unmounts
        return () => {
            // Abort the fetch if it's still ongoing
        };
    }, [url]); // Re-run effect if URL changes

    return { data, loading, error };
}

// Custom hook for making POST requests
export function usePost(url, requestBody) {
    
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.post(url, requestBody);
                setData(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Cleanup function to abort the fetch if component unmounts
        return () => {
            // Abort the fetch if it's still ongoing
        };
    }, [url, requestBody]); // Re-run effect if URL or request body changes

    return { data, loading, error };
}
