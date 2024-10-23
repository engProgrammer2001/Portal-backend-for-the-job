import express from "express";
const router = express.Router();
import isAuthenticated from "../middleware/authenticate.js";
import {
  addCompanies,
  getAllCompanies,
  uploadLogo,
  deleteCompany,
  updateCompaniesDetails,
  getCompanyById,
  getUserWithCompanies,
  searchCompanies
} from "../controller/company.controller.js";

router.post("/add-companies", isAuthenticated, uploadLogo, addCompanies);
router.get("/get-all-companies",  getAllCompanies);
router.get("/get-companies/:id", getCompanyById);
router.get("/get-user-with-companies", isAuthenticated, getUserWithCompanies);
router.put("/update-companies/:id", uploadLogo, updateCompaniesDetails);
router.delete("/delete-companies/:id", isAuthenticated, deleteCompany);
router.get("/search-company", isAuthenticated, searchCompanies);


export default router;
