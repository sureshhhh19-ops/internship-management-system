const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// DB
mongoose.connect("mongodb://127.0.0.1:27017/internshipDB")
.then(()=>console.log("DB Connected"))
.catch(err=>console.log(err));

// MODELS
const User = mongoose.model("User", {
  usn: String,
  email: String,
  role: String,
  password: String
});

const Internship = mongoose.model("Internship", {
  company: String,
  role: String,
  location: String,
  duration: String,
  startDate: String,
  stipend: String,
  slots: Number
});

const Application = mongoose.model("Application", {
  name: String,
  usn: String,
  internship: String,
  status: { type: String, default: "Pending" }
});

// REGISTER
app.post("/register", async (req, res) => {
  const { usn, email, role, password } = req.body;

  const exists = await User.findOne({ usn, role });
  if (exists) return res.send("User already exists");

  await new User({ usn, email, role, password }).save();
  res.send("Registered Successfully");
});

// LOGIN
app.post("/login", async (req, res) => {
  const { usn, password, role } = req.body;

  const user = await User.findOne({ usn, role });

  if (!user) return res.json({ message: "fail" });
  if (user.password !== password) return res.json({ message: "fail" });

  res.json({ message: "Login success", role });
});

// INTERNSHIPS
app.post("/internships", async (req, res) => {
  await new Internship(req.body).save();
  res.send("Internship Added");
});

app.get("/internships", async (req, res) => {
  res.json(await Internship.find());
});

// APPLY
app.post("/apply", async (req, res) => {
  const { name, usn, internship } = req.body;

  await new Application({ name, usn, internship }).save();

  await Internship.updateOne(
    { company: internship },
    { $inc: { slots: -1 } }
  );

  res.send("Applied");
});

// APPLICATIONS
app.get("/applications", async (req, res) => {
  res.json(await Application.find());
});

app.post("/update-status", async (req, res) => {
  const { id, status } = req.body;
  await Application.findByIdAndUpdate(id, { status });
  res.send("Updated");
});

app.listen(8000, () => console.log("Server running on 8000"));