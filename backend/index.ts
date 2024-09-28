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


app.post("/surveys", async (req, res) => {
    const { name, description, questions } = req.body
    try {
        const newSurvey = await client.survey.create({
            data: {
                name,
                description, //sets the surveys title & description
                questions: {
                    /* questions.map((q: { ... }) => ({ ... })):
                    - Purpose: Transforms the input questions array into the format Prisma expects.
                    - Maps each question object to a new object structure.
                    // do this because our prisma schema expects each question to be an object with a question field 
                    // the create field tells prisma to create new Question records for each of these mapped questions
                    */
                    create: questions.map((q: {
                        text: string,
                        type: "TEXT" | "MULTIPLE_CHOICE" | "SCALE" | "YES_NO",
                        options?: string,
                        required: boolean
                    }) => ({ //creates a new object for each object wih=th the specified fields !!
                        text: q.text, //question text 
                        type: q.type, //question type *restricted*
                        options: q.options, //optional field for mc questions 
                        required: q.required //must be answered?
                    })),
                },
            },
            // include: {questions: true} --> prisma option that tells the db query to include the related questions in the returned data
            // without this -> you would only get the survey data without the associated questions  
            include: { questions: true }, //tells prisma to include all the related questions in the retured survey object 
            // allows you to access the created questions directly from survey object 
        });

        res.json(newSurvey)
    } catch (error) {
        res.status(500).json({ error: "failed to create survey" });
    }
})


app.listen(port, () => {
    console.log(`we are listening on port ${port}`)
    console.log(`access on http://localhost:${port}`)
});