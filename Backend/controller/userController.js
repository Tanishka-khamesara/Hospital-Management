import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary"

//for registering a patient----------------------------------------------------------------------------

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, nic, role } = req.body;
    
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !role) {
        return next(new ErrorHandler("Please fill full form",400));
    }
    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("User Already Registered",400))
    }
    user = await User.create({ firstName, lastName, email, phone, password, gender, dob, nic, role });
    generateToken(user, "user Registered!", 200, res);
    // res.status(200).json({
    //     success: true,
    //     message:"user Registered!"
    // })

})
// for login--------------------------------------------------------------------------------------------------------

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;
    
    if (!email || !password || !confirmPassword || !role) {
        return next(new ErrorHandler("please fill all fields", 400));
    }
    if (password !== confirmPassword) {
        return next(new ErrorHandler("password does not match", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("please register first", 400));
    }
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        return next(new ErrorHandler("Invalid Email or password", 400));
    }
    if (role !== user.role) {
        return next(new ErrorHandler("User with this role not found!", 400));
    }
    generateToken(user, "user Logged in Successfully", 200, res);

    // res.status(200).json({
    //     success: true,
    //     message:"user Logged in Successfully"
    // })
})

// for adding new Admin---------------------------------------------------------------------------------
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, nic } = req.body;
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic) {
        return next(new ErrorHandler("Please fill full form",400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} with this email already exists!`));
    }
    const admin = await User.create({ firstName, lastName, email, phone, password, gender, dob, nic, role: "Admin" });
    res.status(200).json({
        success: true,
        message:"New Admin Registered"
    })
})
// get all doctors---------------------------------------------------------------------
export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
    const doctors = await User.find({ role: "Doctor" });

    res.status(200).json({
        success: true,
        doctors
    })
})

// get all details of user--------------------------------------------------------------------------
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    })
})
// to logout admin--------------------------------------------------------------------------------------

export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("adminToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message:"admin logged out succesfully"
    })
})

// to logout patient---------------------------------------------------------------------------

export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("patientToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message:"patient logged out succesfully"
    })
})

//to add new doctor-----------------------------------------------------------------------------

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Doctor avatar Required!", 400));
    }
    const { docAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
        return next(new ErrorHandler("File Format not Supportive!", 400)); 
    }

    const { firstName, lastName, email, phone, password, gender, dob, nic, doctorDepartment } = req.body;
    
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !doctorDepartment) {
        return next(new ErrorHandler("Please fill full form",400));
    }

    const isRegistered = await User.findOne({ email });

    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} already registered with this email`,400));
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.log("Cloudinary Error:", cloudinaryResponse.error || "unknown Cloudinary Error");
    }
    const doctor = await User.create({
        firstName, lastName, email, phone, password, gender, dob, nic, doctorDepartment, role: "Doctor", docAvatar: {
            public_id: cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url,
        }
    })
    res.status(200).json({
        success: true,
        message: "New Doctor Registered",
        doctor
    })

})
