import User from "../models/User.js";

export const getUser = async (call, callback) => {

  try {

    const user = await User.findById(call.request.id);

    if (!user) {
      return callback({
        code: 5,
        message: "User not found"
      });
    }

    callback(null, {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        events: user.events.map(e => e.toString())
      }
    });

  } catch (error) {

    callback({
      code: 16,
      message: error.message
    });

  }

};



export const updateUser = async (call, callback) => {

  try {

    const { id, name, contactNumber } = call.request;

    const user = await User.findById(id);

    if (!user) {
      return callback({
        code: 5,
        message: "User not found"
      });
    }

    if (name) user.name = name;
    if (contactNumber) user.contactNumber = contactNumber;

    await user.save();

    callback(null, {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        events: user.events.map(e => e.toString())
      }
    });

  } catch (error) {

    callback({
      code: 16,
      message: error.message
    });

  }

};



export const deleteUser = async (call, callback) => {

  try {

    const user = await User.findById(call.request.id);

    if (!user) {
      return callback({
        code: 5,
        message: "User not found"
      });
    }

    await user.deleteOne();

    callback(null, {
      message: "User deleted successfully"
    });

  } catch (error) {

    callback({
      code: 16,
      message: error.message
    });

  }

};