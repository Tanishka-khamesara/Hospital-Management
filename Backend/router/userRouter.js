import express from "express";
import { addNewAdmin, addNewDoctor, getAllDoctors, getUserDetails, login, logoutAdmin, logoutPatient, patientRegister } from "../controller/userController.js";
import {isAdminAuthenticated, isPatientAuthenticated} from "../middlewares/auth.js"

const router = express.Router();

router.post("/patient/register", patientRegister); //for registering a patient

router.post("/login", login); //for login

router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);//for adding new admin ny a admin

router.get("/doctors", getAllDoctors); //for getting list of doctors

router.get("/admin/me", isAdminAuthenticated, getUserDetails);//admin seeing user details

router.get("/patient/me", isPatientAuthenticated, getUserDetails); //patient seeing details

router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);//to logout admin

router.get("/patient/logout", isPatientAuthenticated, logoutPatient);//to logout patient

router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor); // for adding new doctor



export default router;