const sgMail = require('@sendgrid/mail');

require("dotenv").config({ 
    path: require("find-config")(".env") 
  });

const sendEmail = async (msgObject) => {
  console.log('===> Inside sendEMail Fct!!!! ')

  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  try {

  const msgSentData = await sgMail.send(msgObject);

  return msgSentData;

  } catch(error) {
    console.error(error);
    console.error(error.response.body);

    return error;
  }

}// end sendEmail fct def

module.exports = sendEmail;
