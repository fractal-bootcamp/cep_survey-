import client from "./prisma/client";
import express from "express"
import cors from "cors"

const port = 3000;

const app = express();
app.use(cors());



//Middleware
app.use(express.json())

const info = [];

app.get('/', (req, res) => {
    res.send(info)
    console.log('testing that logging works')

});

app.get("/surveys", async (req, res) => {
    const surveys = await client.survey.findMany()

    res.json(surveys)
})

app.post("/submit", (req, res) => {
    info.push(req.body)
    console.log('something', req);
    console.log(req.body)
    res.send(info);
})

app.post("/test", async (req, res) => {
    const name = req.body.name

    const newSurvey = await client.survey.create({
        data: {
            name: name
        }
    })

    res.json(newSurvey)
})

app.listen(port, () => {
    console.log(`we are listening on port ${port}`)
    console.log(`access on http://localhost:${port}`)
});