import multer from "multer";
import path from "path";
import Company from "../models/company.model.js";
import User from "../models/user.model.js";
// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Use the original name and add a timestamp to avoid conflicts
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });
// Controller function to add companies

export const addCompanies = async (req, res) => {
  const {
    companyName,
    companyTagLine,
    companyWebsite,
    companyNumber,
    companyAddress,
    companyFacebook,
    companyTwitter,
    companyDescription,
    companyContent,
  } = req.body;
  try {
    const companyLogo = req.file ? req.file.path : null;
    const createdBy = req.id;
    const newCompany = new Company({
      companyName,
      companyTagLine,
      companyLogo,
      companyWebsite,
      companyNumber,
      companyAddress,
      companyFacebook,
      companyTwitter,
      companyDescription,
      companyContent,
      createdBy,
    });
    await newCompany.save();
    const user = await User.findById(createdBy);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.companies.push(newCompany._id);
    await user.save();
    return res
      .status(201)
      .json({ message: "Company added successfully", company: newCompany });
  } catch (error) {
    console.error("Error adding company:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Export multer upload middleware to use in your routes
export const uploadLogo = upload.single("companyLogo");

// Controller function to update company details
export const updateCompaniesDetails = async (req, res) => {
  const { id } = req.params; // Get the company ID from the request params
  console.log("id", id);
  const {
    companyName,
    companyTagLine,
    companyWebsite,
    companyNumber,
    companyAddress,
    companyFacebook,
    companyTwitter,
    companyDescription,
    companyContent,
  } = req.body;

  try {
    // Check if a file is uploaded, and use its path for the company logo
    const companyLogo = req.file ? req.file.path : undefined;

    // Find the company by ID and update the fields
    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      {
        companyName,
        companyTagLine,
        companyWebsite,
        companyNumber,
        companyAddress,
        companyFacebook,
        companyTwitter,
        companyDescription,
        companyContent,
        ...(companyLogo && { companyLogo }), // Only update logo if a new file was uploaded
      },
      { new: true } // This option returns the updated document
    );

    // If the company is not found
    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    return res.status(200).json({
      message: "Company details updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error updating company details:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
export const getAllCompanies = async (req, res) => {
  try {
    // Populate the 'createdBy' field with user details
    const companies = await Company.find().populate("createdBy");

    return res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// delete company
export const deleteCompany = async (req, res) => {
  const id = req.params.id;
  // console.log("company id", id);
  try {
    const deletedCompany = await Company.findByIdAndDelete(id);
    if (!deletedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getCompanyById = async (req, res) => {
  const { id } = req.params; // Get the company ID from the request parameters
  try {
    // Find the company by ID
    const company = await Company.findById(id);
    // If no company is found with the provided ID, return a 404 error
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    // Return the company details if found
    return res.status(200).json(company);
  } catch (error) {
    // Catch any errors and return a 500 status with an error message
    console.error("Error fetching company by ID:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Controller function to search companies by title and location
export const searchCompanies = async (req, res) => {
    try {
        // Extract search parameters from the request query
        const { title, location } = req.query;
        console.log("title:", title, "location:", location);
        // Create a filter object for MongoDB
        const filter = {};

        // If a title is provided, use a case-insensitive regex for partial matching
        if (title) {
            filter.companyName = { $regex: title, $options: 'i' }; // 'i' for case-insensitive
        }

        // If a location is provided, use a case-insensitive regex for partial matching
        if (location) {
            filter.companyAddress = { $regex: location, $options: 'i' }; // 'i' for case-insensitive
        }

        // Query the database with the filter
        const companies = await Company.find(filter);

        // Return the filtered companies as a response
        res.status(200).json(companies);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Controller function to show all company details for a user
export const getUserWithCompanies = async (req, res) => {
  try {
    const userId = req.id; // Assuming the user ID is available through isAuthenticated middleware
    // console.log('userId', userId);
    // Find the user by ID and populate the companies field to get full company details
    const user = await User.findById(userId).populate("companies"); // Assumes companies is an array of ObjectId referring to Company model

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user details including populated companies
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      number: user.number,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      companies: user.companies, // This will now have full company details
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching user and companies:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
