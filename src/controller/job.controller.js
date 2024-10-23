import Company from "../models/company.model.js";
import Job from "../models/job.model.js";

export const postJob = async (req, res) => {
  try {
    const {
      jobTitle,
      jobType,
      jobLocation,
      jobDescription,
      closingData,
      experienceLevel,
      fromSalary,
      toSalary,
      applicationEmail,
      headerImage,
      company, // Should be the company ID
    } = req.body;

    const employerId = req.id; // Assuming req.id is the logged-in user's ID

    const newJob = await Job.create({
      jobTitle,
      jobType,
      jobLocation,
      jobDescription,
      closingData,
      experienceLevel,
      fromSalary,
      toSalary,
      applicationEmail,
      jobStatus: "Open", // You can set a default status
      jobPostedDate: new Date(), // Set the current date as the job posted date
      headerImage,
      company, // Ensure this is the company ID
      created_by: employerId,
    });

    // i want to populate company details from the company ID
    const companyDetails = await Company.findById(company);

    return res.status(200).json({
      message: "Job posted successfully",
      newJob,
      companyDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("company").sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Jobs fetched successfully",
      jobs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const GetAllJobsWithSearch = async (req, res) => {
  try {
    const { title, location, category } = req.query;

    let query = { $and: [] };

    // Keyword matching (for job title and job description)
    if (title) {
      const titleWords = title.split(" ").filter((word) => word.length > 2); // Split by words with length > 2
      query.$and.push({
        $or: [
          { jobTitle: { $regex: titleWords.join("|"), $options: "i" } }, // Match at least one of the keywords
          { jobDescription: { $regex: titleWords.join("|"), $options: "i" } },
        ],
      });
    }

    // Location matching (partial match)
    if (location) {
      query.$and.push({
        jobLocation: { $regex: location, $options: "i" }, // Case-insensitive partial match
      });
    }
    // Category matching
    if (category && category !== "All Categories") {
      query.$and.push({
        jobType: { $regex: category, $options: "i" }, // Match only the selected job type
      });
    }
    // If no search filters are provided, return all jobs
    if (query.$and.length === 0) {
      query = {}; // Empty query for all jobs
    }

    const jobs = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createdAt: -1 });

    if (!jobs.length) {
      return res.status(404).json({ message: "No jobs found" });
    }

    return res.status(200).json({ jobs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getJobById = async (req, res) => {
  try {
    const JobId = req.params.id;
    // console.log("jobid", JobId);

    const jobs = await Job.findById(JobId)
      .populate("company")
      .populate("created_by");
    if (!jobs) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({
      message: "Job fetched successfully",
      jobs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const GetadminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate("company");
    if (!jobs) {
      return res.status(404).json({ message: "Jobs not found" });
    }
    return res.status(200).json({
      message: "Jobs fetched successfully",
      jobs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
