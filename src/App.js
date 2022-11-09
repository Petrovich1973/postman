import React from 'react'
import './App.css';
import {FormRequest} from "./components/FormRequest"
import {FormGetReports} from "./components/FormGetReports"
import ls from "local-storage"
import {FormCreateTask} from "./components/FormCreateTask"

const modeList = {
    single: {
        name: 'Традиционный',
        id: 0,
        panel: <FormRequest/>
    },
    create: {
        name: 'Создание задач',
        id: 1,
        panel: <FormCreateTask/>
    },
    multiple: {
        name: 'Получение отчетов',
        id: 1,
        panel: <FormGetReports/>
    },
}

const keyLs = 'confNavigation'

function App() {
    const [modeCurrent, setModeCurrent] = React.useState('multiple')

    React.useEffect(() => {
        const data = ls.get(keyLs)
        if (data) {
            setModeCurrent(data)
        }
    }, [])

  return (
    <div className="App">
        <h1>POSTMAN v2.0</h1>
        <ul className="nav">
            {Object.keys(modeList).map(key => {
                const isActive = modeCurrent === key
                return (
                    <li
                        key={key}
                        data-active={isActive}
                        onClick={() => {
                            setModeCurrent(key)
                            ls.set(keyLs, key)
                        }}
                    >
                        <span>{modeList[key].name}</span>
                    </li>
                )
            })}
        </ul>

        {modeList[modeCurrent].panel}

    </div>
  );
}

export default App;
