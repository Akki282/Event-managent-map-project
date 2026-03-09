import Vendor from "../models/Vendor.js";

export const createVendor = async (call, callback) => {

    try {

        const { name, email, contactNumber, type } = call.request;

        const vendor = new Vendor({
            name,
            email,
            contactNumber,
            type
        });

        await vendor.save();

        callback(null, {
            vendor: {
                id: vendor._id.toString(),
                name: vendor.name,
                email: vendor.email,
                contactNumber: vendor.contactNumber,
                type: vendor.type
            }
        });

    } catch (error) {

        callback(error);

    }

};



export const getVendor = async (call, callback) => {

    try {

        const vendor = await Vendor.findById(call.request.id);

        if (!vendor) {
            return callback({
                code: 5,
                message: "Vendor not found"
            });
        }

        callback(null, {
            vendor: {
                id: vendor._id.toString(),
                name: vendor.name,
                email: vendor.email,
                contactNumber: vendor.contactNumber,
                type: vendor.type
            }
        });

    } catch (error) {

        callback(error);

    }

};