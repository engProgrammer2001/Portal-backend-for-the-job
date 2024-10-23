import e from "express";
import mongoose from "mongoose";

// Define a Job Schema
const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicants: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicantName: {
      type: String,
      required: true,
    },
    professionalTitle: {
      type: String,
    },
    applicantLocation: {
      type: String,
      required: true,
    },
    applicantNumber: {
      type: String,
      required: true,
    },
    applicantEmail: {
      type: String,
      required: true,
    },
    applicantMessage: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "accepted", "rejected"],
      default: "Pending",
    },
    applicantsImage: {
      type: String,
    },
  },
  { timestamps: true }
);

// Compile the schema into a model
const Application = mongoose.model("Application", applicationSchema);
export default Application;
