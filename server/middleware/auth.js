// server/middleware/auth.js

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Header থেকে 'Authorization' টোকেনটা বের করে আনি
  // এটা দেখতে এরকম হয়: "Bearer eyJhbGciOi..."
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // "Bearer " অংশটা বাদ দিয়ে শুধু টোকেনটা নিই
  const token = authHeader.split(' ')[1];

  // টোকেন আছে কিনা আবার চেক করি
  if (!token) {
    return res.status(401).json({ msg: 'Token format is incorrect, authorization denied' });
  }

  // টোকেনটা আসল কিনা ভেরিফাই করি
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // যদি টোকেন ঠিক থাকে, তাহলে রিকোয়েস্টের সাথে ইউজারের তথ্য যোগ করে দিই
    req.user = decoded.user;
    
    // সব ঠিক থাকলে, পরের ধাপে (আমাদের আসল API controller) যেতে দিই
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};