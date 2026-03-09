import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import { login, register, verifyOtp } from "./grpc/authService.js";

import {
  addGuestToEvent,
  addVendorToEvent,
  createEvent,
  getEvent
} from "./grpc/eventService.js";

import { getUser, updateUser, deleteUser } from "./grpc/userService.js";

import { createVendor, getVendor } from "./grpc/vendorService.js";



const packageDefinition = protoLoader.loadSync(
  [
    "./proto/auth.proto",
    "./proto/event.proto",
  ],
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
);

const proto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();


// ================= AUTH SERVICE =================

server.addService(proto.auth.AuthService.service, {
  Register: register,
  Login: login,
  VerifyOtp: verifyOtp
});


// ================= USER SERVICE =================

server.addService(proto.eventmanagement.UserService.service, {
  GetUser: getUser,
  UpdateUser: updateUser,
  DeleteUser: deleteUser
});


// ================= EVENT SERVICE =================

server.addService(proto.eventmanagement.EventService.service, {
  CreateEvent: createEvent,
  GetEvent: getEvent,
  AddGuestToEvent: addGuestToEvent,
  AddVendorToEvent: addVendorToEvent
});


// ================= VENDOR SERVICE =================

server.addService(proto.eventmanagement.VendorService.service, {
  CreateVendor: createVendor,
  GetVendor: getVendor
});



// ================= START SERVER =================

export const startGrpcServer = () => {

  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {

      console.log("🚀 gRPC Server running on port 50051");

      server.start();

    }
  );

};