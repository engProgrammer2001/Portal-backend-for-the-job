
import express from "express";
const router = express.Router();
import isAuthenticated from "../middleware/authenticate.js";
import { postJob, getAllJobs,getJobById,GetadminJobs,GetAllJobsWithSearch,deleteJob } from "../controller/job.controller.js";



router.post("/post-job", isAuthenticated, postJob);
router.get("/all-job", getAllJobs);
router.get('/get-all-job-withsearch', GetAllJobsWithSearch); 
router.get("/get-job/:id",  getJobById);
router.get("/admin-job", isAuthenticated, GetadminJobs);
router.delete("/delete-job/:id", isAuthenticated, deleteJob);



export default router