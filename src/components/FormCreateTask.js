import React from 'react'
import axios from "axios"
import moment from "moment"
import _ from 'lodash'
import {optionsMethod, msToTime, dir} from '../utils'

const keyLs = 'confCreateTask'

export const FormCreateTask = () => {

    const [url, setUrl] = React.useState('https://bofl.apps.ift-gen1-ds.delta.sbrf.ru/api/v1/task')
    const [method, setMethod] = React.useState('POST')
    const [sortBy, setSortBy] = React.useState('timeStart')
    const [sortDir, setSortDir] = React.useState('asc')
    const [header, setHeader] = React.useState(`{
    "roles": "EFS_ERMOPS_DEPOSIT_BALANCE_STAFF",
    "author": "TWFrbGlzaGluYQ=="
}`)
    const [reportId, setReportId] = React.useState('vkl_11')
    const [numberOfCreatedTasks, setNumberOfCreatedTasks] = React.useState('10')
    const [result, setResult] = React.useState([])
    const [filter, setFilter] = React.useState(`{
    "ID_MEGA": {
        "attributeName": "ID_MEGA",
        "attributeType": "decimal(9,0)",
        "operation": "=",
        "values": "13"
    }
}`)

    const omFetch = async (element) => {
        const {url, headers, method, data} = element
        try {
            const fetch = await axios({
                headers,
                method,
                url,
                data: {...data, reportId}
            })
            const resultResponse = await fetch.data
            writeResult({...element, data: {...resultResponse}, error: '-'})

        } catch (err) {
            writeResult({...element, error: err?.message})
        }

    }

    const writeResult = (element) => setResult(list => list.map(el => {
        const timeNow = Date.now()
        if (el.id === element.id) {
            return ({
                ...element,
                timeEnd: timeNow,
                leadTime: msToTime(timeNow - el.timeStart)

            })
        }
        return ({...el})
    }))

    const onSend = async () => {
        const headers = isValidHeaders(header) ? JSON.parse(header) : {}
        const filters = isValidHeaders(filter) ? JSON.parse(filter) : {}

        const list = [...Array(+numberOfCreatedTasks).keys()]?.map((page, idx) => {
            const id = Date.now()
            return ({
                id: idx,
                url,
                method,
                headers,
                data: {reportId, filters},
                timeStart: id,
                timeEnd: null,
                leadTime: null,
                error: null
            })
        }) || []

        // console.log(list)
        await setResult(list)
        list.forEach(fetchElement => omFetch(fetchElement))
    }

    const isValidHeaders = string => {
        try {
            if (JSON.parse(string)) return true
        } catch (e) {
            return false
        }
        return false
    }

    return (
        <div className={'postmanScreen'}>
            <div>
                <div className={'settingsAll'}>
                    <div className="row">
                        <div className="formElement" style={{width: '70%', flexShrink: 0}}>
                            <label htmlFor="url">url</label>
                            <input
                                id="url"
                                value={url}
                                onChange={e => setUrl(e.target.value)}/>
                        </div>
                        <div className="formElement">
                            <label htmlFor="method">method</label>
                            <select
                                id="method"
                                value={method}
                                onChange={e => setMethod(e.target.value)}>
                                {optionsMethod.map(value => <option key={value} value={value}>{value}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="formElement">
                            <label htmlFor="reportId">reportId</label>
                            <input
                                id="reportId"
                                value={reportId}
                                onChange={e => setReportId(e.target.value)}/>
                        </div>
                        <div className="formElement">
                            <label htmlFor="numberOfCreatedTasks">количество запросов</label>
                            <input
                                id="numberOfCreatedTasks"
                                value={numberOfCreatedTasks}
                                onChange={e => setNumberOfCreatedTasks(e.target.value)}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="formElement" style={{width: '50%', flexShrink: 0}}>
                            <label htmlFor="headers">headers</label>
                            <textarea
                                style={{minHeight: 44, height: 100}}
                                id="headers"
                                value={header}
                                onChange={e => setHeader(e.target.value)} placeholder={'headers: {}'}/>
                        </div>
                        <div className="formElement" style={{width: '50%', flexShrink: 1}}>
                            <label htmlFor="filter">filter</label>
                            <textarea
                                style={{minHeight: 44, height: 100}}
                                id="filter"
                                value={filter}
                                onChange={e => setFilter(e.target.value)} placeholder={'headers: {}'}/>
                        </div>
                    </div>
                    <div className="row">
                        {Number.isInteger(+numberOfCreatedTasks) ? (
                            <><strong>ВСЕГО {numberOfCreatedTasks}</strong> <span>запрос готов к отправке</span></>
                        ) : (
                            <strong className="error">Не валидное значение количества запросов</strong>
                        )}
                    </div>
                    <div className="row">
                        <button onClick={onSend} disabled={!Number.isInteger(+numberOfCreatedTasks) ||!numberOfCreatedTasks }>SEND</button>
                    </div>
                </div>

                <div className="settingsBody">
                    <div style={{marginBottom: 37}}>
                        <h3>Результат {Boolean(result.length && !result.some(s => s.data.status !== 2)) && <span style={{color: "green"}}>Все запросы выполнены успешно!</span>}</h3>

                        {result.length ? (
                            <div>
                                <table className="response">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        {["timeStart", "timeEnd", "leadTime", "error"]
                                            .map((th, i) => (
                                                <th key={i} onClick={() => {
                                                    if (sortBy !== th) setSortDir("asc")
                                                    else setSortDir(dir.filter(f => f !== sortDir)[0])
                                                    setSortBy(th)
                                                }}>{th}</th>
                                            ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {_.orderBy(result, [sortBy], [sortDir]).map((res, idx) => (
                                        <tr key={idx} style={res?.error === '-' ? {backgroundColor: "#539c53", color: "white"} : res?.error ? {backgroundColor: "#c23c3c", color: "white"} :{}}>
                                            <td>{idx + 1}</td>
                                            <td>{res?.timeStart ? moment(res?.timeStart).format('HH:mm:ss:SSS') : '---'}</td>
                                            <td>{res?.timeEnd ? moment(res?.timeEnd).format('HH:mm:ss:SSS') : '---'}</td>
                                            <td>{res?.leadTime ? res?.leadTime : 'waiting...'}</td>
                                            <td>{res?.error}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div> - </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
