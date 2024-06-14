import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/AppointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, nic, dob, gender, appointment_date, department, doctor_firstName, doctor_lastName, hasVisited, address } = req.body;
    
    if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !appointment_date || !department || !doctor_firstName || !doctor_lastName || !hasVisited || !address) {
        return next(new ErrorHandler("All Fields Required", 400));
    }
    //check if there are two or more doctors with same name
    const isConflict = await User.find({
        firstName: doctor_firstName,
        lastName: doctor_lastName,
        role: "Doctor",
        doctorDepartment:department,
    })
    if (isConflict.length === 0) {
        return next(ErrorHandler("Doctor not Found",404))
    }
    if (isConflict.length >1) {
        return next(ErrorHandler("Doctor Conflict! Please Contact Through Email or Phone!",404))
    }
    const doctorId = isConflict[0]._id;
    const patientId = req.user._id;
    const appointment = await Appointment.create({
        firstName, lastName, email, phone, nic, dob, gender, appointment_date, department, doctor: {
            firstName: doctor_firstName,
            lastName: doctor_lastName,
        }, hasVisited, address, doctorId, patientId
    });

    res.status(200).json({
        success: true,
        message: "Appointment send Successfully",
    });

    
})





