const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
 console.log("AUTH HEADER:", req.headers.authorization);
 const token =
  req.headers.authorization?.split(" ")[1];

 if (!token)
  return res
   .status(401)
   .json({ msg: "No token" });

 try {

  const decoded = jwt.verify(
   token,
   process.env.JWT_SECRET
  );

  const user = await User
   .findById(decoded.id);

  if (!user)
   return res
    .status(401)
    .json({ msg: "User not found" });

  if (user.status === "blocked")
   return res
    .status(403)
    .json({ msg: "Account blocked" });

  req.user = user; // ⭐ attach user

  next();

 } catch (err) {
  res
   .status(401)
   .json({ msg: "Invalid token" });
 }
};
