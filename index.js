const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "https://darya-kuliashova-portfolio.netlify.app",
    methods: "GET,POST",
    credentials: true,
  })
);
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/send-email", (req, res) => {
  const { firstname, lastname, email, phone, message } = req.body;

  if (!firstname || !lastname || !email || !message) {
    return res.status(400).send("All fields are required.");
  }

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_TO,
    subject: "New Contact Form Submission",
    text: `
      Name: ${firstname} ${lastname}
      Email: ${email}
      Phone: ${phone || "N/A"}
      Message: ${message}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
