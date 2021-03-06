const conn = require ('../connection/');
const router = require('express').Router();
const isEmail = require('validator/lib/isEmail');
const bcrypt = require ('bcrypt');
const path = require('path')
const multer = require('multer')
const mailVerify = require('../email/nodemailer')
const ports = require('../config/port')



// __dirname: alamat folder file userRouter.js
const rootdir = path.join(__dirname,'/../..')
const photosdir = path.join(rootdir, '/upload/photos')

const folder = multer.diskStorage(
    {
        destination: function (req, file, cb){
            cb(null, photosdir)
        },
        filename: function (req, file, cb){
            // Waktu upload, nama field, extension file
            cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
        }
    }
)

const upstore = multer(
    {
        storage: folder,
        limits: {
            fileSize: 1000000 // Byte , default 1MB
        },
        fileFilter(req, file, cb) {
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ // will be error if the extension name is not one of these
                return cb(new Error('Please upload image file (jpg, jpeg, or png)')) 
            }
    
            cb(undefined, true)
        }
    }
)





// CREATE ONE USER
router.post('/users', (req, res) => {
    // var {username, name, email, password} = req.body

        // tanda tanya akan diganti oleh variable data
        const sql = `INSERT INTO users SET ?`
        const sql2 = `SELECT id, name, email, username, verified FROM users WHERE id = ?`
        const data = req.body
        
    if (!isEmail(data.email)){
        return res.send('Email is invalid')
    }

    // password = bcrypt.hashSync(password, 8) // 'hashSync' adlh proses hash password scr synchronous

    data.password = bcrypt.hashSync(data.password, 8)



    // ALTERNATIF:
    // const sql = `INSERT INTO users(username, name, email, password) 
    //             VALUES ('${username}', '${name}', '${email}', '${password}')` // Library dari sql
    
    conn.query(sql, data, (err, result1) => {
        // Terdapat error ketika insert
        if (err) {
            return res.send(err)
        }
        // res.send(result)
        conn.query(sql2, result1.insertId, (err, result2) => {
            if(err) {
                return res.send(err)
            }

            var user = result2[0]

            mailVerify(user)

            res.send(result2)
        })
    })
})



// UPLOAD AVATAR
router.post('/users/avatar', upstore.single('avatar'), (req, res) => {
    const sql = `SELECT * FROM users WHERE username = ?`
    const sql2 = `UPDATE users SET avatar = '${req.file.filename}'
                    WHERE username = '${req.body.uname}'`
    const data = req.body.uname

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        const user = result[0]

        if(!user) return res.send('User not found')

        conn.query(sql2, (err, result2) => {
            if(err) return res.send(err)

            res.send({
                message: 'Upload berhasil',
                filename: req.file.filename
            })
        })
    })
})



// ACCESS IMAGE
router.get('/users/avatar/:image', (req, res) => {
    // Letak folder photo
    const options = {
        root: photosdir
    }

    // Filename / nama photo
    const fileName = req.params.image

    res.sendFile(fileName, options, function(err){
        if(err) return res.send(err)
        
    })

})



// DELETE IMAGE
router.delete('/users/avatar', (req, res)=> {
    const sql = `SELECT * FROM users WHERE username = '${req.body.uname}'`
    const sql2 = `UPDATE users SET avatar = null WHERE username = '${req.body.uname}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        // nama file
        const fileName = result[0].avatar

        // alamat file
        const imgpath = photosdir + '/' + fileName

        // delete image
        fs.unlink(imgpath, (err) => {
            if(err) return res.send(err)

            // ubah jadi null
            conn.query(sql2, (err, result2) => {
                if(err) res.send(err)

                res.send('Delete berhasil')
            })
        })
    })
})



// READ Profile

// router.get('/users/profile/:username', (req, res) => {

//     // CARA SINGKAT
    
//     // const sql = ` SELECT username, name, email
//     //             FROM users WHERE username = ${req.params.username}`

//     // conn query(data, (err, result) => { ... 

//     // CARA LAIN

//     const sql = `SELECT username, name, email
//                 FROM users WHERE username = ?`
//     const data = req.params.username

//     conn.query(sql, data, (err, result) => {
        
//         // Jika ada error dalam menjalankan query, akan dikirim errornya
//         if(err) return res.send(err)

//         const user = result[0]

//         // jika user tidak di temukan
//         if(!user) return res.send('User not found')

//         res.send(user)
//     })
// })

// READ PROFILE
router.get('/users/profile/:username', (req, res) => {
    const sql = `SELECT username, name, email, avatar
                FROM users WHERE username = ?`
    const data = req.params.username

    conn.query(sql, data, (err, result) => {
        // Jika ada error dalam menjalankan query, akan dikirim errornya
        if(err) return res.send(err)

        const user = result[0]

        // jika user tidak di temukan
        if(!user) return res.send('User not found')

        res.send({
            username: user.username,
            name : user.name,
            email: user.email,
            // avatar: `localhost:${ports}/users/avatar/${user.avatar}`
            avatar: `https://rochafi9mysql.herokuapp.com/users/avatar/${user.avatar}`
        })
    })
})


// UPDATE PROFILE
router.patch('/users/profile/:uname', (req, res) => {
    const sql = `UPDATE users SET ? WHERE username = ?`
    const sql2 = `SELECT username, name ,email 
                    FROM users WHERE username = '${req.params.uname}'`
    const data = [req.body, req.params.uname]

    // UPDATE (Ubah data user di database)
    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        // SELECT (Ambil user dari database)
        conn.query(sql2, (err, result) => {
            // result SELECT adalah array
            if(err) return res.send(err)

            // Kirim usernya dalam bentuk object
            res.send(result[0])
        })
    })
})


// VERIFY USER

router.get('/verify', (req, res) => {
    const sql = `UPDATE users SET verified = true 
                WHERE username = '${req.query.uname}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send('<h1>Verifikasi berhasil</h1>')
    })
})
module.exports = router