const sgMail = require('@sendgrid/mail')
require("dotenv").config({ 
    path: require("find-config")(".env") 
  });

  console.log(process.env.SENDGRID_API_KEY)

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  from: 'nathanperfetti@gmail.com', // Change to your recipient
  to: 'nperfetti@instructors.2u.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error);
    console.error(error.response.body)
  })