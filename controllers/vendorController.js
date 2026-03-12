import Vendor from "../models/Vendor.js";

export const createVendor = async (req, res) => {
  try {
    const { name, email, contactNumber, type } = req.body;

    const vendor = new Vendor({
      name,
      email,
      contactNumber,
      type,
    });

    await vendor.save();

    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();

    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
