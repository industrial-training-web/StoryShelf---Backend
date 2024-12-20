const express = require("express");
const cors = require("cors");

require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

const port = process.env.PORT || 5000;

//  middlewares
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "",
    "",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9odt6wv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
//console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const bookCollection = client.db("storyshelf").collection("books");
  
   
    // add book
    app.post("/books", async (req, res) => {
      const book = req.body;
      console.log("new book", book);
      const result = await bookCollection.insertOne(book);
      res.send(result);
    });
     // get all books data from db
     app.get("/books", async (req, res) => {
      const cursor = bookCollection.find();
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    });
    
    app.delete("/books/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("SIMPLE CRUD IS RUNNNING");
});

app.listen(port, () => {
  console.log(`simple crud is running on port:${port}`);
});
