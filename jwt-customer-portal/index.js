const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()
const secretKey = "b1Aj8HpVPIXZXTEACeUv4RYv1dmxbh8B"

app.use(express.json())

const users = []

app.post('/register', (req, res) => {
    const {username, password} = req.body

    const existingUser = users.find((u) => u.username === username)

    if(existingUser){
        return res.status(400).json({messsage: 'username taken.'})
    }

    const newUser = {
        id: users.length + 1,
        username, 
        password
    }

    users.push(newUser);

    res.status(201).json({message: 'User registration successful.'})
})

app.get('/users', (req, res) => {
    res.json({users});
})

app.post('/login', (req, res) => {
    const{username, password} = req.body

    const user = users.find((u)=>u.username === username && u.password === password);

    if(user){
        const token = jwt.sign({id:user.id, username: user.username}, secretKey)
        res.json({token})
    }else{
        res.status(401).json({message: 'Invalid credentials.'})
    }
})


app.get('/dashboard', verifyToken, (req, res) => {
    res.json({message: 'Welcome to the portal'})
})

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    
    if(typeof token !== 'undefined'){
        jwt.verify(token, secretKey, (err, authData)=> {
            if(err){
                res.sendStatus(403);
            }else{
                req.authData = authData
                next()
            }
        })
    }else{
        res.sendStatus(401);
    }
}

const port = 3000;
app.listen(port, ()=> {
    console.log(`Server running on port ${port}`)
})