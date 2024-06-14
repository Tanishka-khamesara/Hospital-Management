import { catchAsyncErrors } from "./catchAsyncErrors.js";
import {User} from "../models/userSchema.js"
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken"

//admin authentication and authorization
export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return next(new ErrorHandler("Admin Not Authenticated", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    //token m id bheji thi generate token fn m
    req.user = await User.findById(decoded.id);
    if (req.user.role !== "Admin") {
        return next(new ErrorHandler(`${req.user.role} not authorized for this resources!`, 403));
    }
    next();
})

//patient authentication and authorization---------------------------------------

export const isPatientAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
        return next(new ErrorHandler("patient Not Authenticated", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    //token m id bheji thi generate token fn m
    req.user = await User.findById(decoded.id);
    if (req.user.role !== "Patient") {
        return next(new ErrorHandler(`${req.user.role} not authorized for this resources!`, 403));
    }
    next();
})

