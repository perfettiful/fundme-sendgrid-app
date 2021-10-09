const router = require('express').Router();
const { User } = require('../../models');
const sendEmail = require('../../utils/testSendGrid');

require("dotenv").config({ 
  path: require("find-config")(".env") 
});

router.post('/', async (req, res) => {


  try {
    const userData = await User.create(req.body);

    req.session.save(async () => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    console.log("XXXX ERROR: \n", err)
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(async () => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      console.log("=== > User Signed In: \n", req.body);

      // const fromEmail = process.env.SENDGRID_FROM;

      // const userVerificationLink = "localhost:3001/api/users/verify/"+userData.id;
      // const registrationEmail = {
      //   from: fromEmail, 
      //   to: 'nperfetti@instructors.2u.com', 
      //   subject: `Welcome ${req.body.name}, to Our App!! 🎉 🎉 🎉`,
      //   text: 'We thank you for Registering!',
      //   html: `<h1>We thank you for Registering!!</h1> 
      //   <br>
      //   <h2> We thank you for your support!</h2>
      //   <br>
      //   <h3>👉 Please verify your account by following this link:</h3>
      //   <h3><a href='${userVerificationLink}' target="_blank">${userVerificationLink}</h3>
      //   <br>
      //   <hr>
      //   <strong> Sincerely, </strong>
      //   <br>
      //   <strong> ~ The Dev Team 💚</strong>`,
      // }

      // const sendEmailTrigger = await sendEmail(registrationEmail);

      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.get('/verify/:userId', async (req, res) => {

  console.log("Verified User with ID: "+req.params.userId );

  try {
    const userData = await User.update({ where: { id: req.params.userId  } });

    res.json(userData);

  } catch (err) {
    res.status(400).json(err);
  }

})

module.exports = router;
