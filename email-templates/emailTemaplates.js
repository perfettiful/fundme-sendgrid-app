require("dotenv").config({ 
  path: require("find-config")(".env") 
});

const emailTemplates = {

    newRegistration: function(toEmail, firstName ){
      return {
      from: process.env.FROM_EMAIL, 
      to : process.env.TO_EMAIL, 
      subject: `Welcome ${firstName}, to Our App!! 🎉 🎉 🎉`,
      text: 'We thank you for Registering!',
      html: `<h1>We thank you for Registering!!</h1> 
      <br>
      <h2> We thank you for your support!</h2>
      <br>
      <h3>👉 Please verify your account by following this link:</h3>
      <br>
      <hr>
      <strong> Sincerely, </strong>
      <br>
      <strong> ~ The Dev Team 💚 </strong>`
      }
    },
    

}

module.exports = emailTemplates;

