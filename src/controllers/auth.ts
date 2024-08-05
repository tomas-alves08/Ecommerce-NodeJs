import bcrypt from "bcryptjs";
import { Response, Request } from "express";
import { SessionCustom } from "../util/schemas";
import User from "../models/user";
import sendEmail from "../util/mail";

export async function getSignup(req: Request, res: Response, next: Function) {
  const message = req.flash("error");
  let errorMessage: string | null;
  if (message.length) errorMessage = message[0];
  else errorMessage = null;

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage,
    // isAuthenticated: false,
  });
}

export async function postSignup(req: Request, res: Response, next: Function) {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // Encrypting the password
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      req.flash("error", "Email already exists.");
      return res.redirect("/signup");
    }

    const user = new User({
      email,
      password: hashedPassword,
      cart: { items: [] },
    });
    await user.save();

    //Send email
    await sendEmail(
      email,
      "User created successfully",
      `User ${email} created successfully`
    );

    return res.redirect("/login");
  } catch (err: any) {
    console.log(err.message);
  }
}

export async function getLogin(req: Request, res: Response, next: Function) {
  const message = req.flash("error");
  let errorMessage: string | null;
  if (message.length) errorMessage = message[0];
  else errorMessage = null;
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage,
    // isAuthenticated: false,
  });
}

export async function postLogin(req: Request, res: Response, next: Function) {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
    } else {
      try {
        const doMatch = await bcrypt.compare(password, user.password);

        if (doMatch) {
          (req.session as SessionCustom).user = user;
          (req.session as SessionCustom).isLoggedIn = true;

          return (req.session as SessionCustom).save((err) => {
            res.redirect("/");
          });
        }
        res.redirect("/login");
      } catch (err) {
        res.redirect("/login");
      }
    }
  } catch (err: any) {
    console.log(err.message);
  }
}

export async function postLogout(req: Request, res: Response, next: Function) {
  try {
    await (req.session as SessionCustom).destroy((err) => {
      console.log(err);
      res.redirect("/login");
    });
  } catch (err: any) {
    console.log(err.message);
  }
}
