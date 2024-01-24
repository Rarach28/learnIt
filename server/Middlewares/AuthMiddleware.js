const { User } = require("../Models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ data: { data: {}, status: false } });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ data: { data: {}, status: false } });
    } else {
      const user = await User.findById(data.id);

      if (req.permissions) {
        //check if all permissions are in user permissions
        const permissions = req.permissions;
        const userPermissions = user.permissions;
        let hasAllPermissions = true;
        permissions.forEach((permission) => {
          if (!userPermissions.includes(permission)) {
            hasAllPermissions = false;
          }
        });
        if (!hasAllPermissions) {
          return res.json({ data: { data: {}, status: false } });
        }
      }

      if (user)
        return res.json({
          data: { data: {}, status: true }, //, user: user.username
        });
      else return res.json({ data: { data: {}, status: false } });
    }
  });
};
