import React, { useState } from 'react';
import axios from 'axios';

const CreateSurvey = () => {
    const [title, setTitle] = useState(' ');
    const [description, setDescription] = useState(' ');
    const [questions, setQuestions] =
        useState([{ text: '', type: 'TEXT', options: '', required: false }]);

    const handleQuestionChange = (index, field, value) => {
        /* this function takes 3 parameters 
            //index -> the position of the question in the array that we want to update 
            //field -> the specific property of the question we want to change 
            //value -> new value we want to assign 
        */
        const newQuestions = [...questions];
        //[...questions] -> creates a new array that is a shallow copy of current questions array 

        newQuestions[index][field] = value; //updates specific field of question at given index
        setQuestions(newQuestions); //updates state with new array of questions 
    };

    const addQuestions = () => {
        setQuestions([...questions, { text: '', type: 'TEXT', options: '', required: false }])
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/surveys', {
                title,
                description,
                questions
            });
            console.log('Survey created:', response.data);
            //reset form or show success message 
        } catch (error) {
            console.error('Error creating survey:', error);
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Survey Title"
                required
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Survey Description"
            />
            {questions.map((question, index) => ( //iterate over each element of the array containing all the survey questions 
                // each element it calls the provided function with two arguments -> current question object being processed, 
                // & the index of the current question 

                //create container for each question 
                // key{index} is a special prop in react to give each element a stable identity 
                <div key={index}>
                    <input type="text"
                        value={question.text} // controlled component --> current value from state 
                        onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                        //setup event handler for when input value changes --> 
                        // three arguments (position(indice), 'text' (field name to be updated), e.target.value (new value entered))
                        placeholder='Question Text'
                        //sets placeholder text to appear when input is empty
                        required //boolean attribute that makes field required in form submission 
                    />
                    <select // dropdown menu --> react will use this as a controlled component managing its state 
                        // this section will create a dropdown menu that allows the user to chose the type of each question in the survey 
                        value={question.type} // value bound to type allows for dropdown to always reflect current state 
                        onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                    // each option will represent one of the individual dropdown items for user to select 
                    >
                        <option value="TEXT"> Text </option>
                        <option value="MULTIPLE_CHOICE"> Multiple Choice </option>
                        <option value="SCALE"> Scale </option>
                        <option value="YES_NO"> Yes/No </option>
                    </select>

                    {question.type === 'MULTIPLE_CHOICE' && (
                        // CONDITIONAL RENDERING using && -> Javascript expression inside JSX {} 
                        // if question is mutliple choice --> after && is rendered --> if false then nothing
                        <input
                            type="text"
                            value={question.options}
                            onChange={(e) => handleQuestionChange(index, 'options', e.target.value)}
                            placeholder='Options (comma-seperated)'
                        />
                    )}
                </div>
            ))}
            <button type="button" onClick={addQuestions}>Add Question</button>
            <button type="submit"> Create Survey </button>
        </form>
    );
};
export default CreateSurvey;

