const express = require('express')

const app = express()
const port = 3000

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "Error"

    console.log(err.stack)

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
})

app.get('/', async(req, res, next) => {
    res.send("This endpoint works.")
})

app.get('/squarenumber/:num', async (req, res, next) => {
    let x = req.params.num
    if (isNaN(x)) {
        next(new Error("Input is not a number."))
        return
    }
    res.json({"square": x*x})
})

// GET endpoint
app.get('/cubenumber/:num', async (req, res,next) => {
    let x = req.params.num;
    if (isNaN(x)){
        const err = new Error('Invalid input');
        err.statusCode = 400;
        err.details = 'The input must be a number';
        next(err);
    } else {
        res.json({"cube":x*x*x});
    }
});

app.get('/getelementatindex/:word/:idx', async (req, res, next) => {
    let index = parseInt( req.params.idx)
        
    let word = req.params.word
    let charArray = word.split("")

    if (charArray.length < index) {
        const err = new Error('unexpected index');
        err.statusCode = 400;
        err.details = 'The input string length is less than the provided index';
        next(err)
        return
    }

    res.json({ characterAtIndex: charArray[index -1]})
})

app.listen(port, () => {
    console.log(`Server is running on port: localhost:${port}`)
})