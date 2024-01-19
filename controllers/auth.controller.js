import { User } from "../model/user.model.js";
import bcryptjs from "bcryptjs";

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const hashPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashPassword,
  });

  console.log(newUser);

  try {
    await newUser.save();
    res.status(200).json({ message: "Sign up successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const AuthController = { signup };
