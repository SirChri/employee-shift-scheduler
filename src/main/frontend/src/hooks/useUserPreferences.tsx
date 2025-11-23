import { useEffect, useState } from 'react';
import { useNotify, useTranslate } from 'react-admin';
import { dataProvider } from '../dataProvider';

export const useUserPreferences = () => {
    const [userPreferences, setPreferences] = useState<{timezone: string, language: string} | undefined>(undefined);
    const [upLoading, setLoading] = useState(true);
    const [upError, setError] = useState(null);
    const notify = useNotify();
    const translate = useTranslate();

    useEffect(() => {
        // Fetch user preferences on component mount
        dataProvider.getUserPreferences()
            .then((res) => {
                setPreferences(res);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err);
                setLoading(false);
                notify(translate("ess.users.preferences.error_fetch"), { type: 'error' });
            });
    }, [notify, translate]);

    return { userPreferences, upLoading, upError };
};