import { User } from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required."));
  }

  const hashPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashPassword,
  });

  try {
    await newUser.save();
    res.status(200).json({ message: "Sign up successful" });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required."));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(400, "User not found"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(400, "Invalid Password"));
    }

    const token = jwt.sign(
      {
        id: validUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1D" }
    );

    const { password: pass, ...restUserData } = validUser._doc;

    res
      .status(200)
      .cookie("access-token", token, { httpOnly: true })
      .json(restUserData);
  } catch (error) {
    next(error);
  }
};

const google = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1D" }
      );
      const { password, ...restUserData } = user._doc;
      res
        .status(200)
        .cookie("access-token", token, { httpOnly: true })
        .json(restUserData);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashPassword,
        profilePicture: googlePhotoUrl,
      });

      await newUser.save();
      const { password, ...restUserData } = newUser._doc;
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1D" }
      );
      res
        .status(200)
        .cookie("access-token", token, { httpOnly: true })
        .json(restUserData);
    }
  } catch (error) {
    next(error);
  }
};

export const AuthController = { signup, signin, google };
