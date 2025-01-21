const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

async function main() {
  const Db = process.env.ATLAS_URI;
  const client = new MongoClient(Db);

  try {
    console.log("Connecting to the database...");
    await client.connect();

    const logCollection = client.db("ReactShop").collection("logs");
    const log = async (message) => {
      console.log(message);
      await logCollection.insertOne({ message, timestamp: new Date() });
    };

    await log("Fetching collections...");
    const collections = await client.db("ReactShop").collections();

    if (collections.length === 0) {
      await log("No collections found in the database.");
    } else {
      await log("Collections found:");
      for (const collection of collections) {
        await log(`- ${collection.s.namespace.collection}`);

        // Retrieve and log the first document in each collection
        const firstDoc = await collection.findOne();
        await log(
          `Sample document from ${collection.s.namespace.collection}: ${
            firstDoc
              ? JSON.stringify(firstDoc)
              : "No documents in this collection."
          }`
        );
      }
    }
  } catch (e) {
    console.error("An error occurred:", e);
  } finally {
    console.log("Closing the database connection.");
    await client.close();
  }
}

main();
