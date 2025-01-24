const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
};

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      isAdmin: isAdmin || false,
      permissions: permissions || ["read"],
      cart: [],
      purchases: [],
    };

    const result = await db.collection("Users").insertOne(newUser);

    if (!result.insertedId) {
      throw new Error("Failed to create user.");
    }

    // Generate token for the new user
    const token = generateToken(result.insertedId);

    // Return the token in the response
    res.status(201).json({ message: "User registered successfully.", token });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    const user = await db.collection("Users").findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user._id);
    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/protected", authMiddleware, async (req, res) => {
  try {
    const user = await db.collection("Users").findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "This is a protected route.", user });
  } catch (error) {
    console.error("Error fetching protected data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/users/:username/cart", authMiddleware, async (req, res) => {
  try {
    const { username } = req.params;
    const user = await db.collection("Users").findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.cart || []);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/users/:username/cart", authMiddleware, async (req, res) => {
  try {
    const { username } = req.params;
    const { cart } = req.body;

    if (!Array.isArray(cart)) {
      return res.status(400).json({ message: "Cart must be an array" });
    }

    const result = await db
      .collection("Users")
      .updateOne({ username }, { $set: { cart } });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/users/:username/purchases", authMiddleware, async (req, res) => {
  try {
    const { username } = req.params;
    const user = await db.collection("Users").findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.purchases || []);
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/items", (req, res) => {
  fetchCollectionData("Items", res);
});

app.post("/api/items/buy", authMiddleware, async (req, res) => {
  try {
    const { title, quantity, username } = req.body;
    if (!title || !quantity || !username) {
      return res
        .status(400)
        .json({ message: "Title, quantity, and username are required." });
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

    await db
      .collection("Items")
      .updateOne({ title }, { $inc: { quantity: -quantity } });

    const purchase = {
      title,
      quantity,
      purchaseDate: new Date(),
      price: dbItem.price,
    };

    await db.collection("Users").updateOne(
      { username },
      {
        $push: { purchases: purchase },
        $set: { cart: [] },
      }
    );

    res.status(200).json({ message: "Purchase successful" });
  } catch (error) {
    console.error("Error during purchase:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/items/:title/opinion", authMiddleware, async (req, res) => {
  try {
    const { title } = req.params;

    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }

    const item = await db.collection("Items").findOne({ title });

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    res.status(200).json(item.opinions || []);
  } catch (error) {
    console.error("Error fetching opinions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/api/items/:title/opinion", authMiddleware, async (req, res) => {
  try {
    const { title } = req.params;
    const { author } = req.body;

    if (!title || !author) {
      return res
        .status(400)
        .json({ message: "Title and author are required." });
    }

    const item = await db.collection("Items").findOne({ title });
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    const result = await db.collection("Items").updateOne(
      { title },
      {
        $pull: {
          opinions: { author },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "No opinions found for this user." });
    }

    res.status(200).json({ message: "Opinion deleted successfully." });
  } catch (error) {
    console.error("Error deleting opinion:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/items/:title/opinion", authMiddleware, async (req, res) => {
  try {
    const { title } = req.params;
    const { author, content, rating } = req.body;

    if (!author || !content || rating === undefined) {
      return res
        .status(400)
        .json({ message: "Author, content, and rating are required." });
    }

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
      { title },
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

const fetchCollectionData = async (collectionName, res) => {
  try {
    const data = await db.collection(collectionName).find().toArray();
    res.json(data);
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

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
