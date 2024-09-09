import express from 'express';
import cors from 'cors';
import * as externalOperations from "./code-gen.js";
import { MongoClient, ServerApiVersion } from "mongodb";

const app = express();
const port = 3000;
const uri = "mongodb+srv://olusmain:paR0r7oIQ82eM9PI@cluster0.ztby1wg.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
};

app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', false);
app.use(cors(corsOptions));
app.use(express.json());

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`, 'http://localhost:' + port);
    try {
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
});

app.get('/api', (req, res) => {
    res.json({ "OK" : "API is working" });
});

app.post('/api/battleship/createLobby/', async (req, res) => {
    const database = client.db("warship");
    const collection = database.collection("lobbies");

    console.log(externalOperations.generateRandomCode(10));

    try {
        const newLobby = {
            players: [],
            createdAt: new Date(),
        };


    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create lobby', error: error.message });
    }
});



