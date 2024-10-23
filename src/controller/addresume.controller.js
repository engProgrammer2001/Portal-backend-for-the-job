import Resume from "../models/addresume.model.js";

export const addresume = async (req, res) => {
  try {
    const { name, email, region, title, location, category, resumeContent } =
      req.body;

    const newResume = new Resume({
      name,
      email,
      region,
      title,
      location,
      category,
      resumeContent,
    });

    // Save the resume to the database
    const savedResume = await newResume.save();

    res.status(201).json({
      message: "Resume submitted successfully",
      savedResume,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit the resume." });
  }
};

export const getresume = async (req, res) => {
  try {
    const resumes = await Resume.find();
    res.status(200).json(resumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// delete resume
export const deleteresume = async (req, res) => {
  try {
    const resumeId = req.params.id;
    const deletedResume = await Resume.findByIdAndDelete(resumeId);
    if (!deletedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
