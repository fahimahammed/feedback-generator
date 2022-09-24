const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const password ="yFmzj6qea1297Tbm";
const user="fahim_test";
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.zpqcv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(process.env.USER);
async function run(){
    try{
        await client.connect();
        const collection = client.db("ass_kicker").collection("feedbacks");
        console.log("db connected")

        app.put('/add-feedback', async(req, res)=>{
            const feedbackData = req.body;
            const filter = {
                assignmentId: req.body.assignmentId
            }
            const options = { upsert: true};
            const updateDoc = {
                $set: feedbackData
            }
            const result = await collection.updateOne(filter, updateDoc, options);
            res.send({message: "Feedback updated..!"});
        })

        app.get('/feedback/:assignmentId', async(req, res)=>{
            const assignmentId = req.params.assignmentId;
            const feedback = await collection.findOne({assignmentId: assignmentId});
            if(feedback){
                res.send({status: true, feedback: feedback});
            } else{
                res.send({status: false})
            }
            
        })
    }
    catch(err){
        console.log(err);
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})
// app.get("*", (req, res)=>{
//     res.send("Invalid path")
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;