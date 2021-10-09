const router = require('express').Router();
const {User} = require('../../models');
const jwtAuth = require('../../utils/jwtAuth')
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
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

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({
        user: userData,
        message: 'You are now logged in!'
      });
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

router.put('/updatePassword', jwtAuth, async (req, res) => {
  const token = req.headers.authorization;
  const password = req.body.password;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.data.userId;

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await models.User.update({
      hashedPassword
    }, {
      where: {
        id: userId
      }
    })
    return res.send({
      message: 'User created'
    });
  } catch (ex) {
    logger.error(ex);
    res.status(400);
    return res.send({
      error: ex
    });
  }
});// end updatePassword PUT

router.post('/passwordResetRequest', async (req, res) => {
  const email = req.body.email;
  const buffer = await crypto.randomBytes(32);
  const passwordResetToken = buffer.toString("hex");
  try {
    await models.User.update({
      passwordResetToken
    }, {
      where: {
        email
      }
    })
    const passwordResetUrl = `${process.env.FRONTEND_URL}/passwordReset?passwordResetToken=${passwordResetToken}`;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: 'Password Reset Request',
      text: `
          Dear user,
You can reset your password by going to ${passwordResetUrl}
      `,
      html: `
          <p>Dear user,</p>
<p>
              You can reset your password by going to
              <a href="${passwordResetUrl}">this link</a>
          </p>
      `,
    };
    sgMail.send(msg);
    res.send({
      message: 'Successfully sent email'
    });
  } catch (ex) {
    logger.error(ex);
    res.send(ex, 500);
  }
});//end passwordResetRequest POST

router.post('/passwordReset', async (req, res) => {
  const password = req.body.password;
  const passwordResetToken = req.body.passwordResetToken;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const buffer = await crypto.randomBytes(32);
  const newPasswordResetToken = buffer.toString("hex");
  try {
    await models.User.update({
      hashedPassword,
      passwordResetToken: newPasswordResetToken
    }, {
      where: {
        passwordResetToken
      }
    })
    res.send({
      message: 'Successfully reset password'
    });
  } catch (ex) {
    logger.error(ex);
    res.send(ex, 500);
  }
});//end passwordReset POST


module.exports = router;