import jwt from "jsonwebtoken";
import User from "../../models/User.js";

export const grpcAuth = async (call, callback, next) => {

  try {

    const metadata = call.metadata.get("authorization");

    if (!metadata.length) {
      return callback({
        code: 16,
        message: "Authorization token missing"
      });
    }

    const token = metadata[0].replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return callback({
        code: 16,
        message: "User not found"
      });
    }

    call.user = user;

    next();

  } catch (error) {

    callback({
      code: 16,
      message: "Invalid or expired token"
    });

  }

};