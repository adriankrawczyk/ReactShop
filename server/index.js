const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.ATLAS_URI);

app.get("/api/users", async (req, res) => {
  try {
    await client.connect();
    const users = await client
      .db("ReactShop")
      .collection("Users")
      .find()
      .toArray();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
