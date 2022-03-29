const router = require('express').Router();
const { User } = require('../../models');
const sendEmail = require('../../utils/welcomeEmailSendGrid');

require("dotenv").config({ 
  path: require("find-config")(".env") 
});


router.post('/', async (req, res) => {


  try {
    const userData = await User.create(req.body);

    sendEmail( userData.email, userData.name)

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
    const userData = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!userData) {
      res
        .status(400)
        .json({
          message: 'Incorrect email or password, please try again'
        });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({
          message: 'Incorrect email or password, please try again'
        });
      return;
    }

    req.session.save(async () => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      console.log("=== > User Signed In: \n", req.body);

      const sendEmailTrigger = await sendEmail(registrationEmail);

      
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




module.exports = router;
