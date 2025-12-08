const { MongoClient } = require("mongodb");

async function renameDatabase(oldName, newName) {
  const client = new MongoClient("mongodb+srv://zayn_vendora_db:UcEIDMua33vVgbYb@cluster0.lymnjws.mongodb.net/?appName=Cluster0");

  try {
    await client.connect();
    const oldDb = client.db(oldName);
    const newDb = client.db(newName);

    const collections = await oldDb.listCollections().toArray();

    for (const col of collections) {
      const oldCol = oldDb.collection(col.name);
      const newCol = newDb.collection(col.name);

      const docs = await oldCol.find().toArray();
      if (docs.length > 0) {
        await newCol.insertMany(docs);
      }
    }

    await client.db(oldName).dropDatabase();
    console.log("Database renamed successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

renameDatabase("test", "vendora");
