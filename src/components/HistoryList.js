import React from 'react'
import ls from "local-storage"
import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

export const HistoryList = ({
                                onUpdateStateConf = () => console.log('not props onUpdateStateConf'),
                                history = []
                            }) => {

    // const sortList = (a, b) => {
    //     return a.date - b.date
    // }

    return (
        <div>
            {history && history
                // .sort(sortList)
                // .reverse()
                .map(row => (
                <div
                    key={row.date}
                    className="list-item"
                    onClick={() => onUpdateStateConf(row)}
                    style={{cursor: 'pointer'}}>
                    <div className="flex">
                        <div>{row.method}</div>
                        <div style={{marginLeft: 10}}>
                            {moment(row.date).format('dd DD:mm.yyyy HH:MM:SS')}
                        </div>
                    </div>
                    <div style={{overflow: 'hidden', width: '100%'}}>{row.url}</div>
                    {row.body && <div>{JSON.stringify(row.body)}</div>}
                </div>
            ))}
        </div>
    )
}
