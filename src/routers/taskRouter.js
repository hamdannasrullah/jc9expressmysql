const router = require ('express').Router()
const conn = require('../connection')
const ports = require('../config/port')

// CREATE TASK
router.post('/tasks', (req,res) => {
    const sql = `INSERT INTO tasks SET ?`
    const sql2 = `SELECT * FROM tasks WHERE id = ?`
    const data = req.body
    conn.query(sql, data, (err, result) => {
        if(err) return res.send (err)

        conn.query(sql2, result.insertId, (err, result2) => {
            if (err) return res.send (err)

            // res.send(result2)
            // SELECT membertikan result dalam bentuk Array --> ditambahkan [0]
            res.send(result2[0])
        })

        // res.send(result)
    })
})


// READ TASK BY USER ID
router.get('/tasks/:userid', (req, res) => {
    const sql = `SELECT description, completed FROM tasks
                    WHERE user_id = ?`
    const data = req.params.userid

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})


// UPDATE TASK BY TASK ID
router.patch('/tasks/:taskid', (req, res) => {
    const sql = `UPDATE tasks SET completed = true
                    WHERE id = ?`
    const data = req.params.taskid

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })

})


// DELETE TASK BY USER ID
router.delete('/tasks/:taskid', (req, res) => {
    const sql = `DELETE FROM tasks WHERE id = ?`
    const data = req.params.taskid

    conn.query(sql, data,  (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})


module.exports = router