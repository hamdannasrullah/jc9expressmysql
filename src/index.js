const express = require('express')
const ports = require('./config/port')

const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')

const app = express()
// const port = 2020
const port = ports

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Berhasil Running di ' + port);
    
})


app.get('/', (req, res) => {
    res.send(`<h1>API sukses berjalan di PORT ${port}</h1>`)
})
