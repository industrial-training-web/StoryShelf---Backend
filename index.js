const express = require("express");
const cors = require("cors");

require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

const port = process.env.PORT || 5000;

//  middlewares
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "",
    "",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
// app.use(express.json());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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
     
      app.get("/books/:userEmail", async (req, res) => {
        try {
          const userEmail = req.params.userEmail; 
          console.log("User email:", userEmail);
      
          const result = await bookCollection
            .find({ userEmail: userEmail }) 
            .toArray();
      
          console.log("Fetched books:", result);
          res.send(result);
        } catch (error) {
          console.error("Error fetching books:", error);
          res.status(500).send({ message: "Failed to fetch books" });
        }
      });
      
    //delete a book by id
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
