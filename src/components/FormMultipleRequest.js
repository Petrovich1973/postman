import React from 'react'
import axios from "axios"
import moment from "moment"
import _ from "lodash"
import {optionsMethod, msToTime, dir} from '../utils'
import ls from "local-storage";

const keyLs = 'confMultipleRequest'

export const FormMultipleRequest = () => {

    const [url, setUrl] = React.useState('https://bofl.apps.ift-gen1-ds.delta.sbrf.ru/api/v1/report')
    const [method, setMethod] = React.useState('POST')
    const [sortBy, setSortBy] = React.useState('timeStart')
    const [sortDir, setSortDir] = React.useState('asc')
    const [header, setHeader] = React.useState(`{
    "roles": "EFS_ERMOPS_DEPOSIT_BALANCE_STAFF"
}`)
    const [reportId, setReportId] = React.useState('vkl_11')
    const [reportName, setReportName] = React.useState('custom_rozn_cod3d_reversed.svd_cod13_bofl_1666861700117')
    const [size, setSize] = React.useState('1')
    const [pages, setPages] = React.useState('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100')
    const [result, setResult] = React.useState([])

    const omFetch = async (element) => {
        const {url, headers, method, data} = element
        try {
            const fetch = await axios({
                headers,
                method,
                url,
                data: {...data, reportId, reportName}
            })
            const resultResponse = await fetch.data
            writeResult({...element, data: {...resultResponse}})
            if (resultResponse && resultResponse?.status === 1) omFetch({...element, data: {...resultResponse}})
        } catch (err) {
            writeResult({...element, error: err?.message})
        }

    }

    const writeResult = (element) => setResult(list => list.map(el => {
        const timeNow = Date.now()
        if (el.id === element.id) {
            return ({
                ...element,
                requestCount: el.requestCount + 1,
                timeEnd: timeNow,
                leadTime: msToTime(timeNow - el.timeStart)

            })
        }
        return ({...el})
    }))

    const onSend = async () => {
        const headers = isValidHeaders(header) ? JSON.parse(header) : {}

        const list = await convertToListNumbers(pages)?.map((page, idx) => {
            const sizeNumber = Boolean(convertToListNumbers(size)[0]) ? convertToListNumbers(size)[0] : 1
            const id = Date.now()
            return ({
                id: idx,
                url,
                method,
                headers,
                data: {page, size: sizeNumber, reportId, reportName, status: 1},
                requestCount: 0,
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

    const convertToListNumbers = string => {
        try {
            return string
                .split(',')
                .map(element => +element.trim().replace(/[^0-9]/g, ''))
                .filter(element => Boolean(element) && Number.isInteger(element))
        } catch (e) {
            return false
        }
    }

    const isValidList = string => {
        try {
            const list = convertToListNumbers(string)
            return Boolean(list)
        } catch (e) {
            return false
        }
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
                        <div className="formElement" style={{width: '70%', flexShrink: 0}}>
                            <label htmlFor="reportName">reportName</label>
                            <input
                                id="reportName"
                                value={reportName}
                                onChange={e => setReportName(e.target.value)}/>
                        </div>
                        <div className="formElement">
                            <label htmlFor="reportId">reportId</label>
                            <input
                                id="reportId"
                                value={reportId}
                                onChange={e => setReportId(e.target.value)}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="formElement" style={{width: '70%', flexShrink: 0}}>
                            <label htmlFor="headers">headers</label>
                            <textarea
                                style={{minHeight: 44, height: 44}}
                                id="headers"
                                value={header}
                                onChange={e => setHeader(e.target.value)} placeholder={'headers: {}'}/>
                        </div>
                        <div className="formElement">
                            <label htmlFor="pages">pages</label>
                            <input
                                id="pages"
                                value={pages}
                                onChange={e => setPages(e.target.value)}/>
                        </div>
                        <div className="formElement" style={{width: 80, flexShrink: 0}}>
                            <label htmlFor="size">size</label>
                            <input
                                id="size"
                                value={size}
                                onChange={e => setSize(e.target.value)}/>
                        </div>
                    </div>
                    <div className="row">
                        {isValidList(pages) ? (
                            <><strong>ВСЕГО {convertToListNumbers(pages).length}</strong> <span>запроса готовы к отправке</span></>
                        ) : (
                            <strong className="error">Не валидный список</strong>
                        )}
                    </div>
                    <div className="row">
                        <button onClick={onSend}>SEND</button>
                    </div>
                </div>
                <div className="settingsBody">
                    <div style={{marginBottom: 37}}>
                        <h3>Результат {Boolean(result.length && !result.some(s => s.data.status !== 2)) &&
                            <span style={{color: "green"}}>Все запросы выполнены успешно!</span>}</h3>

                        {result.length ? (
                            <div>
                                <table className="response">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        {["status", "timeStart", "reqCount", "timeEnd", "leadTime", "error"]
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
                                        <tr key={idx} style={res?.data.status === 2 ? {
                                            backgroundColor: "#539c53",
                                            color: "white"
                                        } : res?.error ? {backgroundColor: "#c23c3c", color: "white"} : {}}>
                                            <td>{idx + 1}</td>
                                            <td>{res?.data.status}</td>
                                            <td>{res?.timeStart ? moment(res?.timeStart).format('HH:mm:ss:SSS') : '---'}</td>
                                            <td>{res?.requestCount}</td>
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
