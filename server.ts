import express from 'express';
import path from "path";
import cors from "cors";

const app = express();
app.use(cors());


const port = 3000;

//this function navigates through an object using a dot-notated string path, returning the value at that path 
// uses string path to retrieve nested values from an object 
const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((acc, key) => acc && acc[key], obj);
    //path.split(".") --> splits the path string into an array of keys "a.b.c" becomes ["a","b","c"]
    //.reduce((acc,key) => acc && acc[key], obj); --> iteratces through the array of keys 
    //acc --> current nested level of object ; acc && acc[key] --> safely accesses the next level 
};

const processIfStatements = (
    template: string,
    variables: Record<string, any>
    // this is a type definition telling TypeScript to expect an object with string keys and values of any type - safety and flexibility in the function's usage
    // equivalent to saying { [key: string]: any }
): string => {
    // this function takes a template string and a variables object --> and returns a processed string 
    const ifRegex = /{%\s*if\s+([.\w]+)\s*%}([\s\S]*?){%\s*endif\s*%}/g;
    // regex matches patterns like {% if condition %}content{% end if %}
    return template.replace(ifRegex, (match, condition, content) => {
        //uses replace to find all matches of the if-statement pattern and process them 
        // REPLACE method : when used with regular expression -> replace can take function as its second argument - this function is called for each match found by regex
        /* regex has two capture groups ([.\w]+) --> captures condition 
                                       ([\s\S]*?) --> captures content b/w if and endif tages
            MATCH --> will be entire if statement {% if user.loggedIn %}Welcome back!{% endif %}
            CONDITION --> user.loggedin ?
            CONTENT --> content inside the if statement "Welcome back!" */
        const value = getNestedValue(variables, condition);
        return value ? content : "";
    });
};
// this function uses the CONDITION to evaluate whether to include the content or not 
const processVariables = (
    template: string,
    variables: Record<string, any>
): string => {
    const variableRegex = /{{([/s/S]*?)}}/g;
    return template.replace(variableRegex, (match, path) => {
        //
        const trimmedPath = path.trim();
        const value = getNestedValue(variables, trimmedPath);
        return value !== undefined ? String(value) : "";
    });
};

const processForLoops = (
    template: string,
    variables: Record<string, any>
): string => {
    const forRegex = /{%\s*for\s+(\w+)\s+in\s+([.\w]+)\s*%}([\s\S]*?){%\s*endfor\s*%}/g;
    return template.replace(forRegex, (match, item, list, content) => {
        const listValue = getNestedValue(variables, list);
        if (Array.isArray(listValue)) {
            return listValue
                .map((itemValue: any) => {
                    return processVariables(content, { [item]: itemValue });
                })
                .join("");
        }
        return "";
    });
};

const injectTemplateVariables = (
    template: string,
    variables: Record<string, any>
): string => {
    let result = template;
    result = processIfStatements(result, variables);
    result = processForLoops(result, variables);
    result = processVariables(result, variables);
    return result;
};

//middleware: 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(cors());

let surveys: { name: string; content: string }[] = [];

// let messages: { name: string; content: string }[] = [];

// app.get('/') -- .get() mehtod provided by Express to handle HTTP GET request -- ('/') is the ROUTE PATH - in this case the root path of your website 
// (req,res) => { this is beginning of callback function (route handler) - will be executed when a GET request is made to the root path}
// -- it takes TWO parameters - req - the request object (containing info about the HTTP request) - res - the response object (used to send back the HTTP response)
// app.get("/", (req, res) => {
//     const templatePath = path.join(__dirname, "templates", "index.html");
//     const fs = require("fs");
//     function replacePlaceholders(template, data) {

//     }
//     // fs.readFileSync method is used to read the file's content synchronusly and process the files at initialization 
//     // fs.readFileSync(path, options)
//     // this method takes 2 parameters - path of file - and options 
//     let template = fs.readFileSync(templatePath, 'utf8');

//     const data = {
//         title: "Here are my messages",
//         heading: "please read them, they are so insightful",
//         messages: 
// }
//     //implement replacePlaceholders function
//     const html = replacePlaceholders(template, data);

//     res.send(html);
// });

app.get("/home", (_req, res) => {
    const templatePath = path.join(__dirname, "templates", "index.html");
    const fs = require("fs");


    res.send("hello world");
});


app.get("/surveys/:name", (req, res) => {
    const surveysFromName = surveys.filter((survey) => {
        return survey.name === req.params.name;
    });

    res.json(surveysFromName);
});

//set up a route handler for POST requests to the /submit endpoint
app.post('/submit', (req, res) => {
    // extract the 'name' and 'messgae' properties from the request body
    const { name, message } = req.body;
    //check if either field is empty 
    if (!name || !message) {
        // in the case a field is empty - set HTTP status to 400 (400 stands for "bad requests- client error"), .send response with message 'required fields empty' 
        // return stops the execution of the funtion 
        return; res.status(400).send('required fields empty');
    }
    //ADD new message to message array
    surveys.push({ name, content: message });
    //redirect back to home page
    res.redirect('/');
})


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

