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
    const { author, content } = req.body;
    if (!title || !author || !content) {
      return res
        .status(400)
        .json({ message: "Title, author, and content are required." });
    }

    const item = await db.collection("Items").findOne({ title });

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    const opinionExists = item.opinions.some(
      (opinion) => opinion.author === author && opinion.content === content
    );

    if (!opinionExists) {
      return res.status(404).json({ message: "Opinion not found." });
    }

    const result = await db.collection("Items").updateOne(
      { title: title },
      {
        $pull: {
          opinions: {
            author: author,
            content: content,
          },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(500).json({ message: "Failed to remove opinion." });
    }

    res.status(200).json({ message: "Opinion removed successfully." });
  } catch (error) {
    console.error("Error removing opinion:", error);
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
    console.log(req.body);
    const { title } = req.params;
    const { author, content } = req.body;

    if (!author || !content) {
      return res
        .status(400)
        .json({ message: "Both 'author' and 'content' are required." });
    }

    const user = await db.collection("Users").findOne({ username: author });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if item exists and if the user already commented
    // const item = await db.collection("Items").findOne({
    //   title: title,
    //   "opinions.username": author, // Check if this username already commented
    // });

    // if (item) {
    //   return res
    //     .status(400)
    //     .json({ message: "User has already commented on this item." });
    // }

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
