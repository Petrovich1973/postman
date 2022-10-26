import React from 'react'
import axios from "axios"
import moment from "moment"

const keyLs = 'confMultipleRequest'

const optionsMethod = ['GET', 'POST', 'PUT', 'DELETE']

function msToTime(s) {

    function pad(n, z) {
        z = z || 2;
        return ('00' + n).slice(-z);
    }

    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;

    return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
}

export const FormMultipleRequest = () => {

    const [url, setUrl] = React.useState('http://localhost:3001/test')
    const [method, setMethod] = React.useState('POST')
    const [header, setHeader] = React.useState('')
    const [body, setBody] = React.useState('')
    const [dataList, setDataList] = React.useState(`[
    {
        reportId: "vkl_11",
        reportName: "custom_rozn_cod3d_reversed.svd_cod13_bofl_11111111111"

    },
    {
        reportId: "vkl_11",
        reportName: "custom_rozn_cod3d_reversed.svd_cod13_bofl_22222222222"

    },
    {
        reportId: "vkl_11",
        reportName: "custom_rozn_cod3d_reversed.svd_cod13_bofl_33333333333"

    },
    {
        reportId: "vkl_11",
        reportName: "custom_rozn_cod3d_reversed.svd_cod13_bofl_444444444444"

    },
    {
        reportId: "vkl_11",
        reportName: "custom_rozn_cod3d_reversed.svd_cod13_bofl_555555555555"

    }
]`)
    const [result, setResult] = React.useState([])
console.log(method)
    const omFetch = async ({id, url, headers, method, data}) => {
        console.log({
            headers,
            method,
            url,
            data
        })
        const fetch = await axios({
            headers,
            method,
            url,
            data
        })
        const resultResponse = await fetch.data
        writeResult(id, resultResponse)
    }

    const writeResult = (id, resultResponse) => setResult(list => list.map(el => {
        const timeNow = Date.now()
        if(el.id === id) {
            console.log(id)
            return ({
                ...el,
                timeEnd: timeNow,
                waiting: msToTime(timeNow - el.timeStart),
                result: resultResponse
            })
        }
        return ({...el})
    }))

    const onSend = async () => {
        const headers = isValidHeaders(header) ? JSON.parse(header) : {}
        console.log(headers)
        const list = await eval(dataList).map((el, idx) => {
            const id = Date.now()
            return ({
                id: idx,
                url,
                method,
                headers,
                data: {...el},
                timeStart: id,
                timeEnd: null,
                waiting: null,
                result: null
            })
        }) || []

        setResult(list)

        list.forEach((fetchElement, idx) => {
            omFetch(fetchElement)
        })
    }

    const isValidList = string => {
        try {
            if(eval(string)) return true
        } catch (e) {
            return false
        }
        return false
    }

    const isValidHeaders = string => {
        try {
            if(JSON.parse(string)) return true
        } catch (e) {
            return false
        }
        return false
    }


    return (
        <div className={'postmanScreen'}>
            <div>
            <div className={'settingsAll'}>
                <h2>Общая настройка для запросов</h2>
                <div className="row">
                    <div className="formElement" style={{width: '50%'}}>
                        <label htmlFor="url">Адрес</label>
                        <input
                            id="url"
                            value={url}
                            onChange={e => setUrl(e.target.value)}/>
                    </div>
                    <div className="formElement">
                        <label htmlFor="method">Метод</label>
                        <select
                            id="method"
                            value={method}
                            onChange={e => setMethod(e.target.value)}>
                            {optionsMethod.map(value => <option key={value} value={value}>{value}</option>)}
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="formElement" style={{width: '50%'}}>
                        <label htmlFor="headers">Headers</label>
                        <textarea
                            id="headers"
                            value={header}
                            onChange={e => setHeader(e.target.value)} placeholder={'headers: {}'}/>
                    </div>
                    <div className="formElement" style={{width: '50%'}}>
                        <label htmlFor="body">Body <small>Формируется из списка "ИМПОРТ"</small></label>
                        <textarea
                            disabled={true}
                            id="body"
                            value={body}
                            onChange={e => setBody(e.target.value)} placeholder={`Example:
{
    "page": 1,
    "size": 20,
    "reportId": [ идентификатор отчета],
    "reportName": [ имя таблицы в hadoop]
}`}/>
                    </div>
                </div>
            </div>
            <div className="settingsBody">
                <div style={{marginBottom: 37}}>
                    <h3>Импорт объектов для request body</h3>
                    <div className="description">каждый элемент списка будет использован в качестве запроса</div>
                </div>
                <div className="row">
                    <div className="formElement" style={{width: '100%'}}>
                        <textarea
                            id="body"
                            value={dataList}
                            onChange={e => setDataList(e.target.value)} placeholder={`Example:
[
    {
        reportId: "vkl_11",
        reportName: "custom_rozn_cod3d_reversed.svd_cod13_bofl_11111111111"

    },
    {
        reportId: "vkl_11",
        reportName: "custom_rozn_cod3d_reversed.svd_cod13_bofl_22222222222"

    }
]`}/>
                    </div>
                </div>
                <div className="row">
                    {isValidList(dataList) ? (
                        <><strong>ВСЕГО {eval(dataList).length}</strong> <span>запроса готовы к отправке</span></>
                    ) : (
                        <strong className="error">Не валидный список</strong>
                    )}
                </div>
                <div className="row">
                    <button onClick={onSend}>SEND</button>
                </div>
            </div>
            </div>
            {result.length ? <div>
                <h2>Ответ</h2>
                <table className="response">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>reportName</th>
                        <th>timeStart</th>
                        <th>timeEnd</th>
                        <th>timeWaiting</th>
                    </tr>
                    </thead>
                    <tbody>
                    {result.sort((a,b) => a?.timeStart - b?.timeStart).map((res, idx) => (
                        <tr key={idx}>
                            <td>{idx}</td>
                            <td>reportName: {res?.body?.reportName}</td>
                            <td>{res?.timeStart ? moment(res?.timeStart).format('DD:MM.YYYY HH:mm:ss:SSS') : '---'}</td>
                            <td>{res?.timeEnd ? moment(res?.timeEnd).format('DD:MM.YYYY HH:mm:ss:SSS') : '---'}</td>
                            <td>{res?.waiting ? res?.waiting : '...waiting'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div> : ''}
        </div>
    )
}
