const express = require('express');
const cors = require('cors')
const port = 3000;

const app = express();
app.use(cors());



//Middleware
app.use(express.json())

const info = [];

app.get('/names', (req, res) => {
    res.send(info)
    console.log('testing that logging works')

});

app.post("/submit", (req, res) => {
    info.push(req.body)
    console.log('somethog', req);
    console.log(req.body)
    res.send(info);
})

app.listen(port, () => {
    console.log(`we are listening on port ${port}`)
    console.log(`access on http://localhost:${port}`)
});