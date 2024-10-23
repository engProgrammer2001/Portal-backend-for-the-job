import express from "express";
const router = express.Router();
import { addresume, getresume, deleteresume} from "../controller/addresume.controller.js";
import isAuthenticated from "../middleware/authenticate.js";


router.post("/add-resume", isAuthenticated, addresume);
router.get("/get-resume", isAuthenticated, getresume);
router.delete("/delete-resume/:id", isAuthenticated, deleteresume);



export default router;
