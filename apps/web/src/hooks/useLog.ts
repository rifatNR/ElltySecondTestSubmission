import {useEffect} from 'react';

export function useLog<T>(value: T, label?: string) {
    useEffect(() => {
        if (label) {
            console.log(`[useLog] ${label}:`, value);
        } else {
            console.log('[useLog]:', value);
        }
    }, [value]);
}
