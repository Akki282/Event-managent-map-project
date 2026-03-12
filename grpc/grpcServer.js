import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import User from "../models/User.js";
import Event from "../models/Event.js";
import Vendor from "../models/Vendor.js";

import jwt from "jsonwebtoken";

/*
LOAD PROTOS
*/

const authProto = grpc.loadPackageDefinition(
  protoLoader.loadSync("./grpc/protos/auth.proto"),
).auth;

const eventProto = grpc.loadPackageDefinition(
  protoLoader.loadSync("./grpc/protos/event.proto"),
).event;

const userProto = grpc.loadPackageDefinition(
  protoLoader.loadSync("./grpc/protos/user.proto"),
).user;

const vendorProto = grpc.loadPackageDefinition(
  protoLoader.loadSync("./grpc/protos/vendor.proto"),
).vendor;

/*
UTILS
*/

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/*
AUTH SERVICE
*/

const authService = {
  RegisterUser: async (call, callback) => {
    try {
      const { name, email, contactNumber } = call.request;

      let user = await User.findOne({ email });

      if (user) {
        return callback(null, { message: "User already exists" });
      }

      const otp = generateOtp();

      user = new User({
        name,
        email,
        contactNumber,
        otp,
      });

      await user.save();

      callback(null, {
        message: "User registered successfully",
        otp,
      });
    } catch (error) {
      callback(error);
    }
  },

  LoginUser: async (call, callback) => {
    try {
      const { email } = call.request;

      const user = await User.findOne({ email });

      if (!user) {
        return callback(null, { message: "User not found" });
      }

      const otp = generateOtp();

      user.otp = otp;

      await user.save();

      callback(null, {
        message: "OTP sent",
        otp,
      });
    } catch (error) {
      callback(error);
    }
  },

  VerifyOtp: async (call, callback) => {
    try {
      const { email, otp } = call.request;

      const user = await User.findOne({ email });

      if (!user || user.otp !== otp) {
        return callback(null, { message: "Invalid OTP" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      user.otp = null;

      await user.save();

      callback(null, {
        message: "Login successful",
        token,
      });
    } catch (error) {
      callback(error);
    }
  },
};

/*
EVENT SERVICE
*/

const eventService = {
  CreateEvent: async (call, callback) => {
    try {
      const { name, date, venue } = call.request;

      const event = new Event({
        name,
        date,
        venue,
      });

      await event.save();

      callback(null, {
        id: event._id.toString(),
        name: event.name,
        date: event.date.toISOString(),
        venue: event.venue,
      });
    } catch (error) {
      callback(error);
    }
  },

  GetEvents: async (call, callback) => {
    try {
      const events = await Event.find();

      const response = events.map((e) => ({
        id: e._id.toString(),
        name: e.name,
        date: e.date.toISOString(),
        venue: e.venue,
      }));

      callback(null, { events: response });
    } catch (error) {
      callback(error);
    }
  },

  GetEventById: async (call, callback) => {
    try {
      const event = await Event.findById(call.request.id);

      if (!event) return callback(null, {});

      callback(null, {
        id: event._id.toString(),
        name: event.name,
        date: event.date.toISOString(),
        venue: event.venue,
      });
    } catch (error) {
      callback(error);
    }
  },

  AddGuestToEvent: async (call, callback) => {
    try {
      const { eventId, userId } = call.request;

      const event = await Event.findById(eventId);

      if (!event) return callback(new Error("Event not found"));

      event.guests.push(userId);
      await event.save();

      callback(null, {
        id: event._id.toString(),
        name: event.name,
        date: event.date.toISOString(),
        venue: event.venue,
      });
    } catch (error) {
      callback(error);
    }
  },

  AddVendorToEvent: async (call, callback) => {
    try {
      const { eventId, vendorId } = call.request;

      const event = await Event.findById(eventId);

      if (!event) return callback(new Error("Event not found"));

      event.vendors.push(vendorId);
      await event.save();

      callback(null, {
        id: event._id.toString(),
        name: event.name,
        date: event.date.toISOString(),
        venue: event.venue,
      });
    } catch (error) {
      callback(error);
    }
  },
};

/*
USER SERVICE
*/

const userService = {
  GetUser: async (call, callback) => {
    try {
      const user = await User.findById(call.request.id);

      if (!user) {
        return callback(null, {});
      }

      callback(null, {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
      });
    } catch (error) {
      callback(error);
    }
  },

  UpdateUser: async (call, callback) => {
    try {
      const { id, name, email, contactNumber } = call.request;

      const user = await User.findByIdAndUpdate(
        id,
        { name, email, contactNumber },
        { new: true },
      );

      if (!user) return callback(null, {});

      callback(null, {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
      });
    } catch (error) {
      callback(error);
    }
  },

  DeleteUser: async (call, callback) => {
    try {
      await User.findByIdAndDelete(call.request.id);

      callback(null, { message: "User deleted successfully" });
    } catch (error) {
      callback(error);
    }
  },
};

/*
VENDOR SERVICE
*/

const vendorService = {
  CreateVendor: async (call, callback) => {
    try {
      const { name, email, contactNumber, type } = call.request;

      const vendorTypes = [
        "CATERING",
        "DECORATION",
        "PHOTOGRAPHY",
        "MUSIC",
        "LIGHTING",
      ];

      const vendor = new Vendor({
        name,
        email,
        contactNumber,
        type: vendorTypes[call.request.type],
      });

      await vendor.save();

      callback(null, {
        id: vendor._id.toString(),
        name: vendor.name,
        email: vendor.email,
        contactNumber: vendor.contactNumber,
        type: vendor.type,
      });
    } catch (error) {
      callback(error);
    }
  },

  GetVendors: async (call, callback) => {
    try {
      const vendors = await Vendor.find();

      const response = vendors.map((v) => ({
        id: v._id.toString(),
        name: v.name,
        email: v.email,
        contactNumber: v.contactNumber,
        type: v.type,
      }));

      callback(null, { vendors: response });
    } catch (error) {
      callback(error);
    }
  },

  GetVendorById: async (call, callback) => {
    try {
      const vendor = await Vendor.findById(call.request.id);

      if (!vendor) return callback(null, {});

      callback(null, {
        id: vendor._id.toString(),
        name: vendor.name,
        email: vendor.email,
        contactNumber: vendor.contactNumber,
        type: vendor.type,
      });
    } catch (error) {
      callback(error);
    }
  },
};

/*
CREATE SERVER
*/

const server = new grpc.Server();

server.addService(authProto.AuthService.service, authService);
server.addService(eventProto.EventService.service, eventService);
server.addService(userProto.UserService.service, userService);
server.addService(vendorProto.VendorService.service, vendorService);

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("gRPC server running on port 50051");
    server.start();
  },
);
