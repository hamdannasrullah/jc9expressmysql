const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport (
    {
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'hamdan.nasrullah@gmail.com',
            clientId: '1076405312839-f24eq5vstockun4d1k7j6q10nagk97cd.apps.googleusercontent.com',
            clientSecret: 'xs6xo56f6HNm3InhL3k6fsEp',
            refreshToken: '1/nWIw8EMw5TclvWojU8cqZz0QHHnX5s-m99rMaGRM842zYPfGo3H_sR-fSp_qMt7D'
        }
    }
)

const mailVerify = (user) => {
    var {name, username, email} = user

    const mail = {
        from: 'Hamdan Nasrullah<hamdan@hamdan.id>',
        to: 'hamdan.nasrullah@ymail.com',
        subject: 'Please verify your Email Address',
        html: `<h1>HELLO ${name}, PLEASE VERIFY</h1>
        <a href='http://localhost:2020/verify?uname=${username}' >Klik untuk verifikasi</a>`
    }

    transporter.sendMail(mail, (err, result) => {
        if(err) return console.log(err.message)

        console.log(('Email berhasil diverifikasi'));
        
    })
}

module.exports = mailVerify