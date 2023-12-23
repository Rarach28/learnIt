const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  blocked: {
    type: Boolean,
    default: null,
  },
  role_id: {
    type: Number,
    default: null,
  },
  createdAt: {
    type: Number,
    default: new Date().now,
  },
  updatedAt: {
    type: Number,
    default: new Date().now,
  },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

const userPermissionSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
  },
  set_id: {
    type: Number,
    required: true,
  },
});

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);
// const UserPermission = mongoose.model("UserPermission", userPermissionSchema);
// const Role = mongoose.model("Role", roleSchema);

module.exports = User;
// module.exports = mongoose.model("UserPermission", userPermissionSchema);
// module.exports = mongoose.model("Role", roleSchema);

// module.exports = {
//   User,
//   UserPermission,
//   Role,
// };
