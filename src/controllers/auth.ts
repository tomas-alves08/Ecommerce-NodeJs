import bcrypt from "bcryptjs";
// Crypto library provided by NodeJs
import crypto from "crypto";
import { Response, Request } from "express";
import { IError, IUser, SessionCustom } from "../util/schemas";
import User from "../models/user";
import sendEmail from "../util/mail";
import { validationResult } from "express-validator";
import path from "../util/path";

export async function getSignup(req: Request, res: Response, next: Function) {
  const message = req.flash("error");
  let errorMessage: string | null;
  if (message.length) errorMessage = message[0];
  else errorMessage = null;

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage,
    oldInput: { email: "", password: "", confirmPassword: "" },
  });
}

export async function postSignup(req: Request, res: Response, next: Function) {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  //Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword: req.body.confirmPassword },
    });
  }
  try {
    // Encrypting the password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      cart: { items: [] },
    });
    await user.save();

    res.redirect("/login");

    //Send email
    return await sendEmail(
      email,
      "User created successfully",
      `<p>Signup of user ${email} done successfully!</p>`
    );
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
    oldInput: { email: "", password: "", confirmPassword: "" },
  });
}

export async function postLogin(req: Request, res: Response, next: Function) {
  const email = req.body.email;
  const password = req.body.password;

  //Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword: req.body.confirmPassword },
    });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: "Invalid email or password",
        oldInput: {
          email,
          password,
        },
      });
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
    const error: IError = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
}

export async function postLogout(req: Request, res: Response, next: Function) {
  try {
    await (req.session as SessionCustom).destroy((err) => {
      console.log(err);
      res.redirect("/login");
    });
  } catch (err: any) {
    const error: IError = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
}

export async function getReset(req: Request, res: Response, next: Function) {
  const message = req.flash("error");
  let errorMessage: string | null;
  if (message.length) errorMessage = message[0];
  else errorMessage = null;

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage,
  });
}

export function postReset(req: Request, res: Response, next: Function) {
  crypto.randomBytes(32, async (err: Error | null, buffer: Buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");

    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        user.resetToken = token;
        user.resetTokenExpiration = new Date(Date.now() + 3600000);
        await user.save();

        res.redirect("/");
        return await sendEmail(
          req.body.email,
          "Reset user password",
          `<p>Please ignore this e-mail if you haven't requested a password reset.</p>
          <p>Click this <a href='http://localhost:3000/reset/${token}'>Link</a> to set a new password</p>`
        );
      }
    } catch (err: any) {
      const error: IError = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }

    req.flash("error", "No user matches this e-mail address.");
    res.redirect("/reset");
  });
}

export async function getNewPassword(
  req: Request,
  res: Response,
  next: Function
) {
  const message = req.flash("error");
  let errorMessage: string | null;
  if (message.length) errorMessage = message[0];
  else errorMessage = null;

  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (user) {
    res.render("auth/new-password", {
      path: "auth/new-password",
      pageTitle: "New Password",
      errorMessage,
      userId: user._id.toString(),
      token: req.params.token,
    });
  } else {
    req.flash("error", "No user has thie reset token.");
    res.redirect("/reset");
  }
}

export async function postNewPassword(
  req: Request,
  res: Response,
  next: Function
) {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  try {
    const user = await User.findOne({
      _id: userId,
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      await user.save();
      return res.redirect("/login");
    }
  } catch (err: any) {
    const error: IError = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
}
