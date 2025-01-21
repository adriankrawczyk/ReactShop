const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.ATLAS_URI);
let db;

// Connect to MongoDB once when starting the server
const connectDB = async () => {
  try {
    await client.connect();
    db = client.db("ReactShop");
    console.log("Successfully connected to MongoDB.");
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    process.exit(1);
  }
};

// Modified fetchCollectionData function
const fetchCollectionData = async (collectionName, res) => {
  try {
    const data = await db.collection(collectionName).find().toArray();
    res.json(data);
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add opinion to an item by title
app.post("/api/items/:title/opinion", async (req, res) => {
  try {
    console.log(req.body);
    const { title } = req.params;
    const { author, content } = req.body;

    // Validate required fields
    if (!author || !content) {
      return res
        .status(400)
        .json({ message: "Both 'author' and 'content' are required." });
    }

    // Check if user exists
    const user = await db.collection("Users").findOne({ username: author });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if item exists and if the user already commented
    const item = await db.collection("Items").findOne({
      title: title,
      "opinions.username": author, // Check if this username already commented
    });

    if (item) {
      return res
        .status(400)
        .json({ message: "User has already commented on this item." });
    }

    // Add the opinion
    const result = await db.collection("Items").updateOne(
      { title: title },
      {
        $push: {
          opinions: {
            author,
            content,
            createdAt: new Date(),
          },
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Item not found." });
    }

    if (result.modifiedCount === 0) {
      return res.status(500).json({ message: "Failed to add opinion." });
    }

    res.status(201).json({ message: "Opinion added successfully." });
  } catch (error) {
    console.error("Error adding opinion:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update existing routes to use the db variable
app.get("/api/users", (req, res) => {
  fetchCollectionData("Users", res);
});

app.get("/api/items", (req, res) => {
  fetchCollectionData("Items", res);
});

// Connect to MongoDB and start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

// Handle process termination
process.on("SIGINT", async () => {
  try {
    await client.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
    process.exit(1);
  }
});
