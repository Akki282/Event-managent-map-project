import Event from "../models/Event.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";

export const createEvent = async (call, callback) => {

  try {

    const { name, date, venue } = call.request;

    const event = new Event({
      name,
      date,
      venue,
      guests: [],
      vendors: []
    });

    await event.save();

    callback(null, {
      event: {
        id: event._id.toString(),
        name: event.name,
        date: event.date,
        venue: event.venue,
        guests: [],
        vendors: []
      }
    });

  } catch (error) {

    callback({
      code: 16,
      message: error.message
    });

  }

};



export const getEvents = async (call, callback) => {

  try {

    const events = await Event.find();

    const formattedEvents = events.map(event => ({
      id: event._id.toString(),
      name: event.name,
      date: event.date,
      venue: event.venue,
      guests: event.guests.map(g => g.toString()),
      vendors: event.vendors.map(v => v.toString())
    }));

    callback(null, {
      events: formattedEvents
    });

  } catch (error) {

    callback(error);

  }

};



export const getEvent = async (call, callback) => {

  try {

    const event = await Event.findById(call.request.id);

    if (!event) {
      return callback({
        code: 5,
        message: "Event not found"
      });
    }

    callback(null, {
      event: {
        id: event._id.toString(),
        name: event.name,
        date: event.date,
        venue: event.venue,
        guests: event.guests.map(g => g.toString()),
        vendors: event.vendors.map(v => v.toString())
      }
    });

  } catch (error) {

    callback(error);

  }

};



export const addGuestToEvent = async (call, callback) => {

  try {

    const { eventId, userId } = call.request;

    const event = await Event.findById(eventId);

    const user = await User.findById(userId);

    if (!event || !user) {
      return callback({
        code: 5,
        message: "Event or User not found"
      });
    }

    event.guests.push(userId);

    await event.save();

    callback(null, {
      event: {
        id: event._id.toString(),
        name: event.name,
        date: event.date,
        venue: event.venue,
        guests: event.guests.map(g => g.toString()),
        vendors: event.vendors.map(v => v.toString())
      }
    });

  } catch (error) {

    callback({
      code: 16,
      message: error.message
    });

  }

};



export const addVendorToEvent = async (call, callback) => {

  try {

    const { eventId, vendorId } = call.request;

    const event = await Event.findById(eventId);

    const vendor = await Vendor.findById(vendorId);

    if (!event || !vendor) {
      return callback({
        code: 5,
        message: "Event or Vendor not found"
      });
    }

    event.vendors.push(vendorId);

    await event.save();

    callback(null, {
      event: {
        id: event._id.toString(),
        name: event.name,
        date: event.date,
        venue: event.venue,
        guests: event.guests.map(g => g.toString()),
        vendors: event.vendors.map(v => v.toString())
      }
    });

  } catch (error) {

    callback(error);

  }

};