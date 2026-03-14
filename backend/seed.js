const { MongoClient } = require("mongodb");
require("dotenv").config();

async function seed() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db("InventoryDb");

  const sampleProducts = [
    { name: "Laptop", brand: "Dell", price: 50000, stock: 10 },
    { name: "Mobile", brand: "Samsung", price: 20000, stock: 25 },
    { name: "Headphones", brand: "Boat", price: 2000, stock: 50 },
    { name: "Keyboard", brand: "Logitech", price: 1500, stock: 30 }
  ];

  await db.collection("Oddo").insertMany(sampleProducts);
  console.log("✅ Sample data inserted successfully");
  process.exit();
}

seed();