const nodemailer = require ('nodemailer')


const transporter = nodemailer.createTransport(
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

const mail = {
    from: 'Hamdan Nasrullah<hamdan@hamdan.id>',
    to: 'hamdan.nasrullah@ymail.com',
    subject: 'Test Email dengan Gmail API',
    html:'<h2>Authorized JavaScript origins For use with requests from a browser. This is the origin URI of the client application. It must contain a wildcard. If you are using a nonstandard port, you must include it in the origin URI. </h2>'
}


transporter.sendMail(mail, (err, result) => {
    if(err) return console.log(err.message)

    console.log('Sukses');
    
})