const { QdrantClient } = require('@qdrant/js-client-rest');
const crypto = require('crypto');

async function test() {
  const client = new QdrantClient({ url: 'http://localhost:6333' });
  try {
    await client.getCollection('test_col');
  } catch {
    await client.createCollection('test_col', { vectors: { size: 4, distance: 'Cosine' } });
  }

  try {
    // Attempt with Mongo ObjectId style string
    await client.upsert('test_col', {
      wait: true,
      points: [
        { id: "60b8d295f1d2a3001f647201", vector: [0.1, 0.2, 0.3, 0.4], payload: {} }
      ]
    });
    console.log("Mongo string ID worked!");
  } catch (e) {
    console.error("Mongo string ID failed:", e.message);
  }

  try {
    // Attempt with UUID
    await client.upsert('test_col', {
      wait: true,
      points: [
        { id: crypto.randomUUID(), vector: [0.1, 0.2, 0.3, 0.4], payload: {} }
      ]
    });
    console.log("UUID worked!");
  } catch (e) {
    console.error("UUID failed:", e.message);
  }
}

test();
