const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateJWT, authorizeJWT } = require("./middleware/index");
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
//app.use(authenticateJWT);
//app.use(authenticateJWT);

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://sampreetg:sampreetg@samcluster.p1gitx0.mongodb.net/postsDb?retryWrites=true&w=majority&appName=SamCluster"
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Define User schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  email: String,
  password: String,
  name: String,
  //profilePicture: String,
});
const User = mongoose.model("User", userSchema);

// Routes
app.post("/api/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, "secret", {
      expiresIn: "1h",
    });
    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Define login route
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "1h" });
    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/posts", (req, res) => {
  res.json({
    posts: [
      { _id: 1, title: "Post 1" },
      { _id: 2, title: "Post 2" },
    ],
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
