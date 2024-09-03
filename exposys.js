const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/send-emails', upload.single('csvFile'), (req, res) => {
    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'your-email@gmail.com',
                    pass: 'your-email-password'
                }
            });
            results.forEach((row) => {
                const mailOptions = {
                    from: 'your-email@gmail.com',
                    to: row.email,
                    subject: req.body.subject,
                    text: req.body.message
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Email sent: ' + info.response);
                });
            });

            res.send('Emails sent successfully!');
        });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});