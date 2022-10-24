import React from 'react'
import axios from "axios"

const keyLs = 'confMultipleRequest'

const optionsMethod = ['GET', 'POST', 'PUT', 'DELETE']

const listRequests = [
    {
        url: "http://localhost:3001/test",
        method: "POST",
        body: {
            page: 1,
            size: 20,
            reportId: "vkl_1",
            reportName: "custom_rozn_cod3d_1"
        },
        headers: {}
    },
    {
        url: "http://localhost:3001/test",
        method: "POST",
        body: {
            page: 1,
            size: 20,
            reportId: "vkl_2",
            reportName: "custom_rozn_cod3d_2"
        },
        headers: {}
    },
    {
        url: "http://localhost:3001/test",
        method: "POST",
        body: {
            page: 1,
            size: 20,
            reportId: "vkl_3",
            reportName: "custom_rozn_cod3d_3"
        },
        headers: {}
    },
    {
        url: "http://localhost:3001/test",
        method: "POST",
        body: {
            page: 1,
            size: 20,
            reportId: "vkl_4",
            reportName: "custom_rozn_cod3d_4"
        },
        headers: {}
    }
]


export const FormMultipleRequest = () => {

    const [host, setHost] = React.useState('http://localhost:3001/report')
    const [method, setMethod] = React.useState('POST')

    React.useEffect(() => {
        (async () => {
            const fetch = await axios.all([
                ...listRequests.map(item => {
                    return axios.post(item.url, {
                        ...item.body
                    })
                })
            ])
            const response = [...fetch]
            response.forEach(res => console.log(res.data))
        })()

    }, [])

    return (
        <div className="form">
            <div className="form-container">
                <div className={'form-row'} style={{width: '80%'}}>
                    <label htmlFor="host" style={host ? {paddingLeft: 20} : {paddingLeft: 0}}>
                        Host
                    </label>
                    <input
                        style={{display: 'block', boxSizing: 'border-box', width: '100%', height: 44}}
                        type="text"
                        id={'host'}
                        value={host}
                        onChange={e => setHost(e.target.value)}
                        placeholder={'http://localhost/report'}
                    />
                </div>
                <div className="form-row" style={{width: '20%'}}>
                    <label htmlFor="method">Метод</label>
                    <select
                        style={{
                            display: 'block',
                            boxSizing: 'border-box',
                            width: '100%',
                            backgroundColor: '#d8d8d8',
                            height: 44
                        }}
                        id="method"
                        value={method}
                        onChange={e => setMethod(e.target.value)}>
                        {optionsMethod.map(value => <option key={value} value={value}>{value}</option>)}
                    </select>
                </div>
            </div>
        </div>
    )
}
