const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const { google } = require("googleapis");
require("dotenv").config();

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://darya-kuliashova-portfolio.netlify.app/contact"
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const app = express();

app.use(
  cors({
    origin: "https://darya-kuliashova-portfolio-backend.netlify.app",
    methods: "GET,POST",
    credentials: true,
  })
);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/send-emails", (req, res) => {
  res.send("Test route works!");
});

app.get("/routes", (req, res) => {
  res.send([
    { method: "GET", path: "/" },
    { method: "GET", path: "/send-email" },
    { method: "POST", path: "/send-email" },
  ]);
});

app.post("/send-email", async (req, res) => {
  const { firstname, lastname, email, phone, message } = req.body;

  if (!firstname || !lastname || !email || !message) {
    return res.status(400).send("All fields are required.");
  }

  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: "New Contact Form Submission",
      text: `
        Name: ${firstname} ${lastname}
        Email: ${email}
        Phone: ${phone || "N/A"}
        Message: ${message}
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
