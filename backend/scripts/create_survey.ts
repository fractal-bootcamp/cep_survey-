import client from "../prisma/client"


const mockSurvey = {
    name: "A brand new survey"
}

// const newSurvey = await client.survey.create({
//     data: {
//         name: mockSurvey.name
//     }
// })

const newSurvey = await client.survey.findMany()

console.log(newSurvey)