import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js"
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncError(async (req, res, next) => {
    // const { firstName, lastName, email, phone, password, confirmpassword, gender, dob, nic, role } = req.body;
    // if (!firstName || !lastName || !email || !phone || !password || !confirmpassword || !gender || !dob || !nic || !role) {
    //     return next(new ErrorHandler("Please fill full form!", 400))
    // }

    const { firstName, lastName, email, phone, password, confirmpassword, gender, dob, nic } = req.body;
    if (!firstName || !lastName || !email || !phone || !password || !confirmpassword || !gender || !dob || !nic) {
        return next(new ErrorHandler("Please fill full form!", 400))
    }


    //
    if (password !== confirmpassword) {
        return next(new ErrorHandler("Password and Confirm Password do not match!"), 400);
    }
    //
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler("User Already Registered!"), 400)
    }

    const user = await User.create({ firstName, lastName, email, phone, password, gender, dob, nic, role:"Patient" })
    generateToken(user, "user registered!", 200, res);
    // res.status(200).json({
    //     success: true,
    //     message: "User Registered sccessfully :)"
    // })
})



export const login = catchAsyncError(async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return next(new ErrorHandler("Please provide all details!", 400))
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Incorrect email or password entered"), 400)
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Incorrect email or password entered"), 400)
    }

    if (role !== user.role) {
        return next(new ErrorHandler("User with this role not found!"), 400)
    }
    generateToken(user, "user logged in succesfully!", 200, res);
})


export const addNewAdmin = catchAsyncError(async (req, res, next) => {
    const { firstName, lastName, email, phone, nic, dob, gender, password, confirmpassword } =
        req.body;
    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !nic ||
        !dob ||
        !gender ||
        !password ||
        !confirmpassword
    ) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }
    //
    if (password !== confirmpassword) {
        return next(new ErrorHandler("Password and Confirm Password do not match!"), 400);
    }
    //

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} With This Email Already Exists!`, 400));
    }

    const admin = await User.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
        role: "Admin",
    });
    res.status(200).json({
        success: true,
        message: "New Admin Registered",
        admin,
    });
});



export const addNewDoctor = catchAsyncError(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Doctor Avatar Required!", 400));
    }
    const { docAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
        return next(new ErrorHandler("File Format Not Supported!", 400));
    }
    const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
        doctorDepartment,
    } = req.body;
    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !nic ||
        !dob ||
        !gender ||
        !password ||
        !doctorDepartment ||
        !docAvatar
    ) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} With This Email Already Exists!`));
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
        docAvatar.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            "Cloudinary Error:",
            cloudinaryResponse.error || "Unknown Cloudinary error"
        );
        return next(
            new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
        );
    }
    const doctor = await User.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
        role: "Doctor",
        doctorDepartment,
        docAvatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });
    res.status(200).json({
        success: true,
        message: "New Doctor Registered",
        doctor,
    });
});


export const getAllDoctors = catchAsyncError(async (req, res, next) => {
    const doctors = await User.find({ role: "Doctor" });
    res.status(200).json({
        success: true,
        doctors,
    });
});


export const getUserDetails = catchAsyncError(async (req, res, next) => {
    const details = req.user;
    res.status(200).json({
        success: true,
        details,
    });
});



// Logout function for dashboard admin
export const logoutAdmin = catchAsyncError(async (req, res, next) => {
    res
        .status(201)
        .cookie("adminToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),

            //for deployment use this
            secure: true,
            sameSite: "None"  
        })
        .json({
            success: true,
            message: "Admin Logged Out Successfully.",
        });
});

// Logout function for frontend patient
export const logoutPatient = catchAsyncError(async (req, res, next) => {
    res
        .status(201)
        .cookie("patientToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),

            //for deployment use this
            secure: true,
            sameSite: "None"
        })
        .json({
            success: true,
            message: "Patient Logged Out Successfully.",
        });
});