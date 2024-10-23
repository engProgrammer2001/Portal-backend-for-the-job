import mongoose from "mongoose";

// Define a Company Schema
const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      //   required: true,
    },
    companyTagLine: {
      type: String,
    },
    companyLogo: {
      type: String,
    },
    companyWebsite: {
      type: String,
    },
    companyNumber: {
      type: String,
    },
    companyAddress: {
      type: String,
    },
    companyFacebook: {
      type: String,
    },
    companyTwitter: {
      type: String,
    },
    companyDescription: {
      type: String,
    },
    companyContent: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companySchema);
export default Company;
