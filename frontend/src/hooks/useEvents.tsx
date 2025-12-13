import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8080/api/v1/events");
            setEvents(res.data.content);
        } catch (err: any) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return { events, loading, error, refetch: fetchEvents };
};