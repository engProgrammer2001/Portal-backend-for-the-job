import mongoose from "mongoose";
import Application from "../models/application.model.js";

// Define a Job Schema
const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    //   required: true,
  },
  jobType: {
    type: String,
    enum: ["FullTime", "PartTime", "Temporary", "Internship"],
  },
  jobLocation: {
    type: String,
    //   required: true,
  },
  jobDescription: {
    type: String,
    //   required: true,
  },
  closingData: {
    type: String,
    //   required: true,
  },
  experienceLevel: {
    type: String,
    //   required: true,
  },
  fromSalary: {
    type: String,
    //   required: true,
  },
  toSalary: {
    type: String,
    //   required: true,
  },
  applicationEmail: {
    type: String,
    //   required: true,
  },
  jobStatus: {
    type: String,
    enum: ["Open", "Closed"],
    //   required: true,
  },
  jobPostedDate: {
    type: Date,
    //   required: true,
  },
  headerImage: {
    type: String,
    default:
      "https://png.pngtree.com/png-vector/20190115/ourmid/pngtree-vector-lock-icon-png-image_316863.jpg",
    //   required: true,
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  ],
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Compile the schema into a model
const Job = mongoose.model("Job", jobSchema);
export default Job;
