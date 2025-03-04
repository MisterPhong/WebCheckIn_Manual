const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb://localhost:27017"; // เปลี่ยนเป็น URI ของคุณ
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("Timetrack");
    const collection = database.collection("Time");

    const documents = await collection.find().toArray();
    console.log(documents);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
