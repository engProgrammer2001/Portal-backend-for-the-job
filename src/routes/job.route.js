
import express from "express";
const router = express.Router();
import isAuthenticated from "../middleware/authenticate.js";
import { postJob, getAllJobs,getJobById,GetadminJobs,GetAllJobsWithSearch } from "../controller/job.controller.js";



router.post("/post-job", isAuthenticated, postJob);
router.get("/all-job", getAllJobs);
router.get('/get-all-job-withsearch', GetAllJobsWithSearch); 
router.get("/get-job/:id",  getJobById);
router.get("/admin-job", isAuthenticated, GetadminJobs);



export default router