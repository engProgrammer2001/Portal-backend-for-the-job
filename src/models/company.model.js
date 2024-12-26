import mongoose from "mongoose";

// Define a Company Schema
const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: "Job Provide Company",
      //   required: true,
    },
    companyTagLine: {
      type: String,
      default: "Job Provide Company for all kinds of Job",
    },
    companyLogo: {
      type: String,
      default:
        "https://t4.ftcdn.net/jpg/04/18/10/09/360_F_418100923_V8L9ASbg9NpPdCMk210e3fHVoo07ypgJ.jpg",
    },
    companyWebsite: {
      type: String,
      default: "https://jobprovide.com",
    },
    companyNumber: {
      type: String,
      default: "1234567890",
    },
    companyAddress: {
      type: String,
      default: "123 Main Street, Anytown USA",
    },
    companyFacebook: {
      type: String,
      default: "https://www.facebook.com",
    },
    companyTwitter: {
      type: String,
      default: "https://www.twitter.com",
    },
    companyDescription: {
      type: String,
      default: "Job Provide Company for all kinds of Job",
    },
    companyContent: {
      type: String,
      default: "Job Provide Company for all kinds of Job",
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
