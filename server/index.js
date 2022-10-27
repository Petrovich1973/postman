const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors({origin: '*'}))
app.use(bodyParser.json())

const port = 3002

let db = []

app.post('/test', (req, res) => {
    // console.log(req.body)
    setTimeout(() => {
        if (db.some(s => s.page === req.body.page)) {
            db = db.filter(f => f.page !== req.body.page)
            if(req.body.page === 42) {
                res.status(500).send({...req.body, status: 1})
            } else {
                res.send({...req.body, status: 2})
            }
        } else {
            db = [...db, req.body]
            res.send({...req.body, status: 1})
        }
    }, 100)
})

app.get('/test', (req, res) => {
    res.send({message: 'GET /test working!'})
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
