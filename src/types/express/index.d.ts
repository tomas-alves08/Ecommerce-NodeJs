import { IUser } from "../../util/schemas";

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null; // Define user property as optional
    }
  }
}
