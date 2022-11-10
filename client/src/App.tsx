import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import MyApp from "./views";
import './App.css';
import { dataProvider } from './dataProvider';
import { Loading } from 'react-admin';
import systemConfigs from './sysConfigs';

const App = () => {
    /*const [sysconfigs, setSysConfigs] = useState<any | null>(null)

    useEffect(() => {
        dataProvider.getSystemConfigs()
            .then(configs => {
                setSysConfigs(configs)

                for (var k in configs) {
                    if (configs.hasOwnProperty(k)) {
                        (systemConfigs as any)[k] = configs[k];
                    }
                }
            });
    }, [])

    if (!sysconfigs) {
        return (
            <Loading />
        )
    }*/

    return (
        <MyApp />
    );
}

export default App;
