const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.ATLAS_URI);
const fetchCollectionData = async (collectionName, res) => {
  try {
    await client.connect();
    const data = await client
      .db("ReactShop")
      .collection(collectionName)
      .find()
      .toArray();
    res.json(data);
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
};

app.get("/api/users", (req, res) => {
  fetchCollectionData("Users", res);
});

app.get("/api/items", (req, res) => {
  fetchCollectionData("Items", res);
});

// Sign up new user
app.post("/api/users/signup", async (req, res) => {
  try {
    await client.connect();
    const { username, email, password, isAdmin, permissions } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if username already exists
    const existingUser = await client
      .db("ReactShop")
      .collection("Users")
      .findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if email already exists
    const existingEmail = await client
      .db("ReactShop")
      .collection("Users")
      .findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create new user
    const result = await client
      .db("ReactShop")
      .collection("Users")
      .insertOne({
        username,
        email,
        password,
        isAdmin: isAdmin || false,
        permissions: permissions || ["user"],
      });

    res.status(201).json({
      message: "User created successfully",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
