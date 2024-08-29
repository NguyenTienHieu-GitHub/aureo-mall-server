const pool = require("../../config/db/index");
const userModel = require("../../app/models/UserModel");
const bcrypt = require("bcrypt");

const registerUser = (req, res) => {
  const { email, phone, password } = req.body;
  pool.query(
    userModel.checkEmailExits,
    [email],
    (CheckMailError, CheckMailResults) => {
      if (CheckMailError) {
        console.error("Error checking email existence:", CheckMailError);
        return res.status(500).send("Internal Server Error");
      }

      if (CheckMailResults.rows.length > 0) {
        return res.status(400).send("Email already exists.");
      }
      pool.query(
        userModel.checkPhoneExits,
        [phone],
        (CheckPhoneError, CheckPhoneResults) => {
          if (CheckPhoneError) {
            console.log("Error checking phone existence:", CheckPhoneError);
            return res.status(500).send("Internal Server Error");
          }
          if (CheckPhoneResults.rows.length > 0) {
            return res.status(400).send("Phone already exists.");
          }
          // Kiểm tra điều kiện mật khẩu trước khi mã hóa
          const passwordRegex =
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{12,23}$/;
          if (!passwordRegex.test(password)) {
            return res
              .status(400)
              .send("Password does not meet the requirements.");
          }
          // Mã hóa mật khẩu
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
              console.log("Error hashing password", err);
              return res.status(500).send("Internal Server Error");
            }
            // Add User to db
            pool.query(
              userModel.addUser,
              [email, phone, hashedPassword],
              (addError, addResults) => {
                if (addError) {
                  console.error("Error adding user:", addError);
                  return res.status(500).send("Internal Server Error");
                }

                const newUser = addResults.rows[0];
                res.status(201).json(newUser); // Return the newly created user
              }
            );
          });
        }
      );
    }
  );
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  pool.query(
    userModel.checkEmailExits,
    [email],
    (CheckMailError, CheckMailResults) => {
      if (CheckMailError) {
        console.error("Error checking email existence:", CheckMailError);
        return res.status(500).send("Internal Server Error");
      }
      if (checkEmailResults.rows.length > 0) {
        return res.status(400).send("Invalid email or password.");
      }
      const hashedPassword = res.rows[0].password;
      // Load hash from your password DB.
      bcrypt.compare(password, hashedPassword, function (err, result) {
        // result == true
        if (err) {
          console.error("Error checking password:", err);
          return res.status(500).send("Internal Server Error");
        }

        if (result) {
          return res.status(200).send("Login successfully");
        } else {
            return response.json({success: false, message: 'passwords do not match'});
        }
      });
    }
  );
};

module.exports = {
  registerUser,
  loginUser,
};
