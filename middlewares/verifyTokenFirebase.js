const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Middleware function to verify Firebase token
const verifyTokenFirebase = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    // console.log('Decoded Token from verifyTokenFirebase:', decodedToken);
    next();
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = verifyTokenFirebase;