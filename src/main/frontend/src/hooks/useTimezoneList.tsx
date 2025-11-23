import { useEffect, useState } from 'react';
import { useNotify, useTranslate } from 'react-admin';
import { dataProvider } from '../dataProvider';

export const useTimezoneList = (withEmptyRow: boolean) => {
    const [timezones, setTimezones] = useState<{code: string, description: string}[]>([]);
    const [tzLoading, setLoading] = useState(true);
    const [tzError, setError] = useState(null);
    const notify = useNotify();
    const translate = useTranslate();

    useEffect(() => {
        // Fetch timezone list on component mount
        dataProvider.getLookupList("timezone", "code", "ASC")
            .then((res) => {
                let data = res.data;
                if (withEmptyRow)
                    data.unshift({ code: null, description: "" }); // Add default empty option
                
                setTimezones(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err);
                setLoading(false);
                notify(translate("ess.users.preferences.error_fetch"), { type: 'error' });
            });
    }, [notify, translate]);

    return { timezones, tzLoading, tzError };
};