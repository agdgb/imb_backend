const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const vendorPaymentsRouter = require('./routes/vendor_payment')

const app = express()
const port = 3000;

app.use(bodyParser.json())

const uri = "mongodb://localhost:27017"
mongoose.connect(uri, {dbName: 'transactionsDB'})

app.use('/vendorPayments', vendorPaymentsRouter)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})