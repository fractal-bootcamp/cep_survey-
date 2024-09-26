import { useState } from 'react'
import './App.css'
import axios from 'axios';

const serverUrl = "http://localhost:3000";

function App() {
    const [message, setMessage] = useState("")

    console.log(message)


    const onFormSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        // submit the message to the server.
        console.log(message)

        event.preventDefault(); // what does this do?
        // prevents the default behavior of the form submission event.
        const res = await axios.post(serverUrl + "/submit", { message: message })
        console.log(res)
    }

    return (
        <>
            <h1> hello </h1>
            <form onSubmit={onFormSubmit}>
                <input onChange={(e) => setMessage(e.target.value)} value={message} type="text" name="message" />
                <button type="submit">clickme</button>
            </form>
        </>
    )
}

export default App
