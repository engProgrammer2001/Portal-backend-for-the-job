import Application from "../models/application.model.js";
import Job from "../models/job.model.js";

export const applyForJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    const {
      applicantName,
      professionalTitle,
      applicantLocation,
      applicantNumber,
      applicantEmail,
      applicantMessage,
      category,
      applicantsImage,
    } = req.body;

    if (
      !applicantName ||
      !applicantLocation ||
      !applicantNumber ||
      !applicantEmail ||
      !category
    ) {
      return res.status(400).json({
        message: "All required fields must be provided: applicantName, applicantLocation, applicantNumber, applicantEmail, category.",
      });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicantName,
      professionalTitle,
      applicantLocation,
      applicantNumber,
      applicantEmail,
      applicantMessage,
      category,
      status: req.body.status || "Pending",
      applicantsImage,
      applicants: req.user ? req.user.id : null,
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res.status(200).json({
      message: "Application submitted successfully",
      applicationId: newApplication._id,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getAllApplications = async (req, res) => {
  try {
    const userId = req.id;
    const applications = await Application.find({ applicants: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: { path: "company" },
        options: { sort: { createdAt: -1 } },
        populate: { path: "applications" },
        options: { sort: { createdAt: -1 } },
      });
    if (!applications) {
      return res.status(404).json({
        message: "Applications not found",
      });
    }

    return res.status(200).json({
      message: "Applications fetched successfully",
      applications,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const jobs = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: { path: "user" },
      options: { sort: { createdAt: -1 } },
    });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found",
      });
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
export const updateApplicationStatus = async (req, res) => {
  try {
    const status = req.body.status;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    // find application by id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    // update status
    application.status = status.toLowerCase();
    await application.save();
    return res
      .status(200)
      .json({ message: "Application status updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// get total number of applications
export const getTotalApplications = async (req, res) => {
  try {
    const totalApplications = await Application.find().populate("job");
    return res.status(200).json({
      message: "Total Applications fetched successfully",
      totalApplications,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getAllApplicationsByEmployer = async (req, res) => {
  try {
    const employerId = req.id; // Assuming this is the employer's user ID from the token
    // Find all jobs posted by this employer
    const jobsPostedByEmployer = await Job.find({ created_by: employerId });

    if (!jobsPostedByEmployer) {
      return res.status(404).json({
        message: "No jobs posted by this employer",
      });
    }

    // Get all job IDs posted by the employer
    const jobIds = jobsPostedByEmployer.map((job) => job._id);

    // Find all applications related to the jobs posted by this employer
    const applications = await Application.find({ job: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: { path: "company" },
      });

    if (!applications.length) {
      return res.status(404).json({
        message: "No applications found for jobs posted by this employer",
      });
    }

    return res.status(200).json({
      message: "Applications fetched successfully",
      applications,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
