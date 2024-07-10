const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('YOUR_GOOGLE_CLIENT_ID');

const verifyToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: 'YOUR_GOOGLE_CLIENT_ID',
  });
  const payload = ticket.getPayload();
  return payload;
};

exports.googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await verifyToken(token);
    // Now you can create a session or do something with the user data
    res.status(200).json(user);
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
};
