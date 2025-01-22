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

app.delete("/api/items/:title/opinion", async (req, res) => {
  try {
    const { title } = req.params;
    const decodedTitle = decodeURIComponent(title);
    const { author } = req.body;

    if (!decodedTitle || !author) {
      return res
        .status(400)
        .json({ message: "Title and author are required." });
    }

    const item = await db.collection("Items").findOne({ title: decodedTitle });

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    const userOpinionsExist = item.opinions.some(
      (opinion) => opinion.author === author
    );

    if (!userOpinionsExist) {
      return res
        .status(404)
        .json({ message: "No opinions found for this user on the item." });
    }

    const result = await db.collection("Items").updateOne(
      { title: decodedTitle },
      {
        $pull: {
          opinions: {
            author: author,
          },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(500).json({ message: "Failed to remove opinions." });
    }

    res
      .status(200)
      .json({ message: "All opinions by the user removed successfully." });
  } catch (error) {
    console.error("Error removing opinions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/users/signup", async (req, res) => {
  try {
    const { username, password, email, isAdmin, permissions } = req.body;
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ message: "Username, password, and email are required." });
    }
    const existingUser = await db.collection("Users").findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user with this username already exists." });
    }
    const newUser = {
      username,
      password,
      email,
      isAdmin: isAdmin || false,
      permissions: permissions || ["read"],
    };

    await db.collection("Users").insertOne(newUser);

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const fetchCollectionData = async (collectionName, res) => {
  try {
    const data = await db.collection(collectionName).find().toArray();
    res.json(data);
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

app.post("/api/items/:title/opinion", async (req, res) => {
  try {
    const { title } = req.params;
    const { author, content, rating } = req.body;

    if (!author || !content || rating === undefined) {
      return res
        .status(400)
        .json({ message: "Author, content, and rating are required." });
    }

    // Validate rating
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be a number between 1 and 5." });
    }

    const user = await db.collection("Users").findOne({ username: author });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const result = await db.collection("Items").updateOne(
      { title: title },
      {
        $push: {
          opinions: {
            author,
            content,
            rating: numRating,
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

app.post("/api/items/buy", async (req, res) => {
  try {
    const { title, quantity } = req.body;
    if (!title || !quantity) {
      return res
        .status(400)
        .json({ message: "Title and quantity are required." });
    }
    const dbItem = await db.collection("Items").findOne({ title });
    if (!dbItem) {
      return res.status(404).json({ message: `Item "${title}" not found.` });
    }
    if (dbItem.quantity < quantity) {
      return res
        .status(400)
        .json({ message: `Not enough stock for item "${title}".` });
    }
    await db.collection("Items").updateOne(
      { title },
      {
        $inc: { quantity: -quantity },
      }
    );

    res.status(200).json({ message: "Purchase successful." });
  } catch (error) {
    console.error("Error during purchase:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add an endpoint to get average rating for an item
app.get("/api/items/:title/rating", async (req, res) => {
  try {
    const { title } = req.params;
    const item = await db.collection("Items").findOne({ title });

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    if (!item.opinions || item.opinions.length === 0) {
      return res.json({ averageRating: 0, totalOpinions: 0 });
    }

    const totalRating = item.opinions.reduce(
      (sum, opinion) => sum + opinion.rating,
      0
    );
    const averageRating = totalRating / item.opinions.length;

    res.json({
      averageRating: Number(averageRating.toFixed(1)),
      totalOpinions: item.opinions.length,
    });
  } catch (error) {
    console.error("Error getting average rating:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/users", (req, res) => {
  fetchCollectionData("Users", res);
});

app.get("/api/items", (req, res) => {
  fetchCollectionData("Items", res);
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

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
