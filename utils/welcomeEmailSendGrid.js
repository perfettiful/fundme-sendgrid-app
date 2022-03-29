const sgMail = require("@sendgrid/mail");
const { newRegistration } = require("../email-templates/emailTemaplates");

require("dotenv").config({
  path: require("find-config")(".env"),
});

const sendEmail = async (template, toEmail, firstName) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    const emailTemplate = newRegistration(toEmail, firstName);

    const msgSentData = await sgMail.send(emailTemplate);

    return msgSentData;
  } catch (error) {
    console.error(error);

    return error;
  }
}; // end sendEmail fct def

module.exports = sendEmail;
