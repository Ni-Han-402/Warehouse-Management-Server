const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.s5dw6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemCollection = client.db('sofaMart').collection('furnitureItem');

        //Auth
        app.post('/login', async(req, res) =>{
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '7d'
            });
            res.send({accessToken})
        })

        //Server Api
        //Get Multiple Item
        app.get('/item', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        //Get Single Item
        app.get('/item/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const item = await itemCollection.findOne(query);
            res.send(item);
        })

        //Post
        app.post('/item', async(req, res) =>{
            const newItem = req.body;
            const result = await itemCollection.insertOne(newItem);
            res.send(result);
        });


        //My Item

        app.get('/myitem', async(req, res) =>{
            const email = req.query.email;
            console.log(email);
            const query = {email: email};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

        //Delete
        app.delete('/item/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        })
        app.delete('/myitem/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        })

        //Single Item Quantity Update
        app.put('/item/:id', async(req, res) =>{
            const id = req.params.id;
            const updateItem = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updateData = {
                $set: {
                    quantity: updateItem.newQuantity
                }
            };
            const result = await itemCollection.updateOne(filter, updateData, options);
            res.send(result);
        })


        app.put('/item/:id', async(req, res) =>{
            const id = req.params.id;
            const updateItem = req.body.item.quantity;
            console.log(deliveredItem);
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const deliveredData = {
                $set: {
                    quantity: updateItem.makeDeliveredQuantity
                }
            };
            const result = await itemCollection.updateOne(filter, deliveredData, options);
            res.send(result);
        })
}
    finally {

    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Server');
})

app.listen(port, () => {
    console.log('Listening to port', port);
})
