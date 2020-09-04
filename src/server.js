import express from "express";
import bodyParser from 'body-parser';
import {MongoClient} from 'mongodb';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.json());

app.get('/users', async (req, res) => {
    try {
        const userName = req.query.name;
        
        const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
        const db = client.db('my-app-test-db');

        const userLastName = await db.collection('users').findOne({ name: userName });
        res.status(200).json(userLastName);
        client.close();

    } catch (error) {
        res.status(500).json({ message: "Error connecting to db", error })
    }
})

app.post('/users', async (req, res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;

        const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
        const db = client.db('my-app-test-db');

        const userLastName = await db.collection('users').insertOne({ name: firstName, lastName: lastName});
        res.status(200).json(userLastName);
        client.close();
        
    } catch (error) {
        res.status(500).json({ message: "Error connecting to db", error })
    }
})

app.get('/user', (req, res) => {
    res.send(`This is ${req.body.name}!`)
});

app.post('/hello', (req, res) => {
    res.send(`Hello ${req.body.name}!`)
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
})

app.listen(8080, () => console.log("Listening on 8080"));