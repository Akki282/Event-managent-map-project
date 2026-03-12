import Event from "../models/Event.js";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";

export const createEvent = async (req, res) => {
  try {
    const { name, date, venue } = req.body;

    const event = new Event({
      name,
      date,
      venue,
      guests: [req.user._id],
    });

    await event.save();

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("guests", "name email")
      .populate("vendors", "name type");

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("guests", "name email")
      .populate("vendors", "name type");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addGuestToEvent = async (req, res) => {
  try {
    const { userId } = req.body;

    const event = await Event.findById(req.params.id);

    const user = await User.findById(userId);

    if (!event || !user) {
      return res.status(404).json({ message: "Event or User not found" });
    }

    event.guests.push(userId);

    await event.save();

    res.json({ message: "Guest added", event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addVendorToEvent = async (req, res) => {
  try {
    const { vendorId } = req.body;

    const event = await Event.findById(req.params.id);

    const vendor = await Vendor.findById(vendorId);

    if (!event || !vendor) {
      return res.status(404).json({ message: "Event or Vendor not found" });
    }

    event.vendors.push(vendorId);

    await event.save();

    res.json({ message: "Vendor added", event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
