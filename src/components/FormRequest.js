import React from 'react'
import axios from "axios"
import ls from "local-storage"
import {HistoryList} from "./HistoryList"

const optionsMethod = ['GET', 'POST', 'PUT', 'DELETE']

const keyLs = 'confRequest'

export const FormRequest = () => {
    const [waiting, setWaiting] = React.useState(false)
    const [history, setHistory] = React.useState([])
    const [url, setUrl] = React.useState('')
    const [method, setMethod] = React.useState('GET')
    const [body, setBody] = React.useState('')
    const [responseStatus, setResponseStatus] = React.useState('')
    const [responseHeaders, setResponseHeaders] = React.useState('')
    const [responseBody, setResponseBody] = React.useState('')
    const [responseError, setResponseError] = React.useState('')

    React.useEffect(() => {
        const test = ls.get(keyLs)
        if (test) {
            onUpdateHistory(test)
        }
    }, [])

    const onUpdateHistory = (data) => {
        setHistory(data)
    }

    const onSetForm = (data) => {
        setUrl(data.url)
        setMethod(data.method)
        setBody(data.body)
    }

    const onUpdateLocalStorage = async () => {
        const mewRow = {date: Date.now(), url, method, body}
        const list = await ls.get(keyLs) || []
        await ls.set(keyLs, [...list, mewRow])
        onUpdateHistory([...list, mewRow])
    }

    const onRemoveLocalStorage = () => {
        ls.remove(keyLs)
    }

    const onResetForm = () => {
        setUrl('')
        setMethod('GET')
        setBody('')
    }

    const onSendRequest = async () => {
        setWaiting(true)
        setResponseStatus('')
        setResponseHeaders('')
        setResponseBody('')
        setResponseError('')
        try {
            const request = await axios({
                method,
                url,
                data: {...body}
            })
            const resStatus = await request.status
            const resHeaders = await request.headers
            const resBody = await request.data
            setResponseStatus(resStatus)
            setResponseHeaders(resHeaders)
            setResponseBody(resBody)
        } catch (err) {
            console.log(err)
            setResponseError(JSON.stringify(err))
        }
        setWaiting(false)
    }

    return (
        <>
            <div className="form flex">
                <div style={{flexGrow: 1, boxSizing: 'border-box', maxWidth: '60%'}}>
                    <div className="flex">
                        <div className="form-row" style={{width: '80%'}}>
                            <label htmlFor="url">Адрес</label>
                            <input
                                style={{display: 'block', boxSizing: 'border-box', width: '100%'}}
                                id="url"
                                type="text"
                                value={url}
                                onChange={e => setUrl(e.target.value)}/>
                        </div>
                        <div className="form-row" style={{width: '20%'}}>
                            <label htmlFor="method">Метод</label>
                            <select
                                style={{
                                    display: 'block',
                                    boxSizing: 'border-box',
                                    width: '100%',
                                    backgroundColor: '#d8d8d8'
                                }}
                                id="method"
                                value={method}
                                onChange={e => setMethod(e.target.value)}>
                                {optionsMethod.map(value => <option key={value} value={value}>{value}</option>)}
                            </select>
                        </div>
                    </div>

                    {(method === 'POST' || method === 'PUT') && (
                        <div className="form-row">
                            <label htmlFor="body">Тело запроса(body)</label>
                            <textarea
                                style={{
                                    display: 'block',
                                    boxSizing: 'border-box',
                                    width: '70%',
                                    resize: 'vertical',
                                    minHeight: '150px'
                                }}
                                id="body"
                                value={body}
                                onChange={e => setBody(e.target.value)}/>
                        </div>
                    )}

                    <div className="flex">
                        <div className="form-row">
                            <button disabled={!url || waiting} onClick={onSendRequest}>Отправить запрос</button>
                        </div>
                        <div className="form-row" style={{marginLeft: 20}}>
                            <button disabled={!url && method === 'GET' && !body} style={{backgroundColor: '#d3d0b2'}}
                                    onClick={onResetForm}>Очистить
                            </button>
                        </div>
                        <div className="form-row" style={{marginLeft: 20}}>
                            <button disabled={!url} style={{backgroundColor: '#b2d3cc'}}
                                    onClick={onUpdateLocalStorage}>Сохранить
                            </button>
                        </div>
                    </div>
                    {waiting && (
                        <div className="lds-ellipsis">
                            <div/>
                            <div/>
                            <div/>
                            <div/>
                        </div>
                    )}
                    {responseStatus && (
                        <div className="response">
                            <div className="form-row">
                                <label>Статус ответа</label>
                                {JSON.stringify(responseStatus)}
                            </div>
                            <div className="form-row">
                                <label>Заголовки ответа</label>
                                {JSON.stringify(responseHeaders)}
                            </div>
                            <div className="form-row">
                                <label>Тело ответа</label>
                                {JSON.stringify(responseBody)}
                            </div>
                        </div>
                    )}

                    {responseError && (
                        <div className="response">
                            <div className="form-row">
                                <label>Ошибка!</label>
                                {JSON.stringify(responseError)}
                            </div>
                        </div>
                    )}
                </div>
                <div style={{maxWidth: '40%', boxSizing: 'border-box'}}>
                    <div className="flex" style={{alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
                        <label>Сохраненные запросы</label>
                        <button onClick={onRemoveLocalStorage}>удалить историю</button>
                    </div>
                    <HistoryList history={history} onUpdateStateConf={onSetForm}/>
                </div>
            </div>
        </>
    )
}
