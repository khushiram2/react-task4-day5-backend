import express from "express"
import cors from "cors"
import { MongoClient, ObjectId } from "mongodb"
import * as dotenv from "dotenv"
const app = express()
app.use(express.json())
app.use(cors())
dotenv.config()

const port=process.env.port

async function createconnection(){
    try{
        const client= new MongoClient(process.env.url)
        await  client.connect()
        console.log("mongo connected")
        return client
    }catch(err){
          return "some error occured"  
    }
}

const client= await createconnection()
//get all users
app.get("/users", async (req,res)=>{
    const users=await client
    .db("users")
    .collection("users")
    .find({}).toArray()
    res.send(users)
})
// get a single user by id

app.get("/user/:id", async (req,res)=>{
    const {id}=req.params;
    const user=await client
    .db("users")
    .collection("users")
    .findOne({_id:new ObjectId(id)})
    res.send(user)
})

// post a new user
app.post("/newuser", async (req,res)=>{
    const {newuser}= req.body
    const users=await client
    .db("users")
    .collection("users")
    .insertOne(newuser)
    res.send(users)
})

// edit a user
app.put("/edituser/:id", async (req,res)=>{
    const {id}=req.params
    const {newuser}= req.body
    const {name,email,image}=newuser
    const users=await client
    .db("users")
    .collection("users")
    .updateOne({_id:new ObjectId(id)},{$set:{name:name,email:email,image:image}})
    res.send(users)
})
// delete a user
app.delete("/delete/:id", async (req,res)=>{
const {id}=req.params
const deletedUser= await client
.db("users")
.collection("users")
.deleteOne({_id:new ObjectId(id)})
res.send(deletedUser)
})
app.listen(port,()=>console.log("app started on " ,port))