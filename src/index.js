const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "daria.kuliashova@gmail.com",
    pass: "12431243DashsaLeshsa", // Замените на пароль от почты
  },
});

app.post("/send-email", (req, res) => {
  const { firstname, lastname, email, phone, message } = req.body;

  const mailOptions = {
    from: email,
    to: "daria.kuliashova@gmail.com",
    subject: "New Contact Form Submission",
    text: `
      Name: ${firstname} ${lastname}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent");
    }
  });
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
