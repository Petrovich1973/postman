import React from 'react'
import moment from 'moment'
import 'moment/locale/ru'

moment.locale('ru')

export const HistoryList = ({
                                onUpdateStateConf = () => console.log('not props onUpdateStateConf'),
                                history = []
                            }) => {

    return (
        <div>
            {history.map(row => (
                <div
                    key={row.date}
                    className="list-item"
                    onClick={() => onUpdateStateConf(row)}
                    style={{cursor: 'pointer'}}>
                    <div className="flex">
                        <div><strong>{row.method}</strong></div>
                        <div style={{marginLeft: 10}}>
                            <small>{moment(row.date).format('dd DD:MM.yyyy HH:mm:ss')}</small>
                        </div>
                    </div>
                    <div style={{overflow: 'hidden', width: '100%'}}>{row.url}</div>
                    {JSON.stringify(row.body) !== '{}' && <div className="word-wrap">{JSON.stringify(row.body)}</div>}
                </div>
            ))}
        </div>
    )
}
