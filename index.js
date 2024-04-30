const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

//mongodb connection


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lbylvoy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //database created for user collection
    const userCollection = client.db('artCraft').collection('user');

    //user sent to database
    app.post('/user', async (req, res) => {
      const user = req.body;
      // console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result)
    });

    //add product to database
    const itemCollection = client.db('artCraft').collection('items');
    app.post('/addItem', async (req, res) => {
      const item = req.body;
      const result = await itemCollection.insertOne(item);
      console.log(result);
      res.send(result);

    })

    //get item from database
    app.get('/myItem/:email', async (req, res) => {
      // console.log(req.params.email);
      const result = await itemCollection.find({ email: req.params.email }).toArray();
      res.send(result)
    })

    //get single item from database to update item
    app.get('/singleItem/:id', async (req, res) => {
      console.log(req.params.id);
      const result = await itemCollection.findOne({ _id: new ObjectId(req.params.id) })
      console.log(result)
      res.send(result)
    })

    //update item in database
    app.put('/updateitem/:id', async (req, res) => {
      console.log(req.params.id);
      const query = { _id: new ObjectId(req.params.id) };
      const newData = {
        $set: {
          itemName: req.body.itemName,
            photo: req.body.photo,
          subcategory: req.body.subcategory,
            price: req.body.price,
          rating: req.body.rating,
            customization: req.body.customization,
          processingTime: req.body.processingTime,
            stockStatus: req.body.stockStatus,
          description: req.body.description
        }
      }
      const result = await itemCollection.updateOne(query, newData);
      console.log(result);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('art & craft server is running');

})

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
})