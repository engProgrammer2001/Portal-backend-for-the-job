import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import userRoute from "./src/routes/user.route.js";
import companyRoute from "./src/routes/company.route.js";
import jobRoute from "./src/routes/job.route.js";
import applicationRoute from "./src/routes/application.route.js";
import resumeRoute from "./src/routes/addresume.route.js";

dotenv.config({});

const app = express();

// Base route
app.get("/", (req, res) => {
  const imageUrl = "https://www.adorama.com/alc/wp-content/uploads/2021/05/bird-wings-flying-feature.gif";
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Job Portal</title>
        <style>
            body {
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #b6d6e7;
            }
            img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
            }
        </style>
    </head>
    <body>
        <img src="${imageUrl}" alt="Bird Wings Flying">
    </body>
    </html>
  `);
});


app.use('/uploads', express.static('uploads'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors());

const PORT = process.env.PORT || 5454;

// Register and login route
app.use("/user", userRoute);

// Add company routes
app.use("/company", companyRoute);

app.use("/job", jobRoute);

// Application routes 
app.use("/application", applicationRoute);

// Add resume routes
app.use("/resume", resumeRoute);

// Start the server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
