import React from 'react'
import axios from "axios"
import ls from "local-storage"
import ReactJson from 'react-json-view'
import {HistoryList} from "./HistoryList"

const optionsMethod = ['GET', 'POST', 'PUT', 'DELETE']

const keyLs = 'confRequest'

const isEmpty = (obj) => {
    for (let key in obj) {
        // если тело цикла начнет выполняться - значит в объекте есть свойства
        return false
    }
    return true
}

export const FormRequest = () => {
    const [waiting, setWaiting] = React.useState(false)
    const [history, setHistory] = React.useState([])
    const [url, setUrl] = React.useState('')
    const [method, setMethod] = React.useState('GET')
    const [body, setBody] = React.useState({})
    const [headers, setHeaders] = React.useState({})
    const [responseStatus, setResponseStatus] = React.useState('')
    const [responseHeaders, setResponseHeaders] = React.useState('')
    const [responseBody, setResponseBody] = React.useState('')
    const [responseError, setResponseError] = React.useState('')
    const [responseErrorTitle, setResponseErrorTitle] = React.useState('')

    React.useEffect(() => {
        const data = ls.get(keyLs)
        if (data) {
            onUpdateHistory(data)
        }
    }, [])

    const onUpdateHistory = (data) => {
        setHistory(data)
    }

    const onSetForm = (data) => {
        setUrl(data.url)
        setMethod(data.method)
        setBody(data.body)
        setHeaders(data.headers)
    }

    const onUpdateLocalStorage = async () => {
        const newRow = {date: Date.now(), url, method, body, headers}
        const list = await ls.get(keyLs) || []
        const result = [newRow, ...list]
        await ls.set(keyLs, result)
        onUpdateHistory([newRow, ...list])
    }

    const onRemoveLocalStorage = () => {
        ls.remove(keyLs)
        setHistory([])
    }

    const onResetForm = () => {
        setUrl('')
        setMethod('GET')
        setBody({})
        setHeaders({})
    }

    const onSendRequest = async () => {
        setWaiting(true)
        setResponseStatus('')
        setResponseHeaders('')
        setResponseBody('')
        setResponseError('')
        setResponseErrorTitle('')
        try {
            const request = await axios({
                headers,
                method,
                url,
                data: body
            })
            const resStatus = await request?.status
            const resHeaders = await request.headers
            const resBody = await request.data
            setResponseStatus(resStatus)
            setResponseHeaders(resHeaders)
            setResponseBody(resBody)
        } catch (err) {
            console.log(err)
            setResponseError(JSON.stringify(err))
            setResponseErrorTitle(`${err?.response?.status} ${err?.response?.statusText}`)
        }
        setWaiting(false)
    }

    return (
        <div className="form">
            <div style={{flexGrow: 1, boxSizing: 'border-box', maxWidth: '60%'}}>
                <div className="flex">
                    <div className="form-row" style={{width: '80%'}}>
                        <label htmlFor="url">Адрес</label>
                        <input
                            style={{display: 'block', boxSizing: 'border-box', width: '100%'}}
                            id="url"
                            type="text"
                            value={url}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    onSendRequest()
                                }
                            }}
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

                <div className="form-row">
                    <label htmlFor="headers">Headers запроса</label>
                    <ReactJson
                        src={headers}
                        theme="monokai"
                        name={null}
                        displayObjectSize={false}
                        onAdd={(add) => setHeaders(add.updated_src)}
                        onEdit={(edit) => setHeaders(edit.updated_src)}
                        onDelete={(del) => setHeaders(del.updated_src)}
                        collapsed={false}/>
                </div>

                {(method === 'POST' || method === 'PUT') && (
                    <div className="form-row">
                        <label htmlFor="body">Тело запроса(body)</label>
                        <ReactJson
                            src={body}
                            theme="monokai"
                            name={null}
                            displayObjectSize={false}
                            onAdd={(add) => setBody(add.updated_src)}
                            onEdit={(edit) => setBody(edit.updated_src)}
                            onDelete={(del) => setBody(del.updated_src)}
                            collapsed={false}/>
                    </div>
                )}

                <div className="flex">
                    <div className="form-row">
                        <button disabled={!url || waiting} onClick={onSendRequest}>Отправить запрос</button>
                    </div>
                    <div className="form-row" style={{marginLeft: 20}}>
                        <button disabled={!url && method === 'GET' && isEmpty(body)}
                                style={{backgroundColor: '#d3d0b2'}}
                                onClick={onResetForm}>Reset
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
                            <h4>Ошибка!</h4>
                            <div>{responseErrorTitle}</div>
                            &nbsp;
                            <div>{JSON.stringify(responseError)}</div>
                        </div>
                    </div>
                )}
            </div>
            {Boolean(history.length) && (
                <div style={{maxWidth: '40%', boxSizing: 'border-box'}}>
                    <div className="flex"
                         style={{alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
                        <label>Сохраненные запросы</label>
                        <button style={{transform: 'scale(0.7)'}} onClick={onRemoveLocalStorage}>удалить историю
                        </button>
                    </div>
                    <HistoryList history={history} onUpdateStateConf={onSetForm}/>
                </div>
            )}
        </div>
    )
}
