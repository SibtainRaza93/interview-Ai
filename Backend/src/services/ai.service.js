const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer")
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// Zod schema
const interviewReportSchema = z.object({
    title: z.string(),

    matchScore: z.number()
        .min(0)
        .max(100),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string(),
        })
    ),

    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string(),
        })
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"]),
        })
    ),

    preparationPlans: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string()),
        })
    ),
});

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription,
}) {

    const prompt = `
Generate an interview preparation report.

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

IMPORTANT:
Return ONLY valid JSON.

Follow this exact structure:

{
    "title": "Backend Developer Intern",
    "matchScore": 82,

    "technicalQuestions": [
        {
            "question": "Question here",
            "intention": "Why interviewer asks this",
            "answer": "How candidate should answer"
        }
    ],

    "behavioralQuestions": [
        {
            "question": "Question here",
            "intention": "Why interviewer asks this",
            "answer": "How candidate should answer"
        }
    ],

    "skillGaps": [
        {
            "skill": "JWT Authentication",
            "severity": "medium"
        }
    ],

    "preparationPlans": [
        {
            "day": 1,
            "focus": "Node.js",
            "tasks": [
                "Study Node.js event loop",
                "Practice asynchronous programming"
            ]
        }
    ]
}

IMPORTANT:
- technicalQuestions must contain OBJECTS, not strings.
- behavioralQuestions must contain OBJECTS, not strings.
- skillGaps must contain OBJECTS, not strings.
- preparationPlans must contain OBJECTS, not strings.
- matchScore must be a NUMBER, not "82%".
- severity must be exactly "low", "medium", or "high".
- day must be a NUMBER.
- tasks must be an ARRAY of strings.
- Do not put JSON objects inside quotation marks.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,

        config: {
            responseMimeType: "application/json",

            responseSchema: {
                type: "OBJECT",

                properties: {
                    title: {
                        type: "STRING",
                    },

                    matchScore: {
                        type: "NUMBER",
                    },

                    technicalQuestions: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                question: {
                                    type: "STRING",
                                },
                                intention: {
                                    type: "STRING",
                                },
                                answer: {
                                    type: "STRING",
                                },
                            },
                            required: [
                                "question",
                                "intention",
                                "answer",
                            ],
                        },
                    },

                    behavioralQuestions: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                question: {
                                    type: "STRING",
                                },
                                intention: {
                                    type: "STRING",
                                },
                                answer: {
                                    type: "STRING",
                                },
                            },
                            required: [
                                "question",
                                "intention",
                                "answer",
                            ],
                        },
                    },

                    skillGaps: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                skill: {
                                    type: "STRING",
                                },
                                severity: {
                                    type: "STRING",
                                    enum: [
                                        "low",
                                        "medium",
                                        "high",
                                    ],
                                },
                            },
                            required: [
                                "skill",
                                "severity",
                            ],
                        },
                    },

                    preparationPlans: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                day: {
                                    type: "NUMBER",
                                },
                                focus: {
                                    type: "STRING",
                                },
                                tasks: {
                                    type: "ARRAY",
                                    items: {
                                        type: "STRING",
                                    },
                                },
                            },
                            required: [
                                "day",
                                "focus",
                                "tasks",
                            ],
                        },
                    },
                },

                required: [
                    "title",
                    "matchScore",
                    "technicalQuestions",
                    "behavioralQuestions",
                    "skillGaps",
                    "preparationPlans",
                ],
            },
        },
    });

    console.log("RAW GEMINI RESPONSE:", response.text);

    // Convert Gemini JSON string into JavaScript object
    const parsedResponse = JSON.parse(response.text);

    // Validate Gemini response with Zod
    const validatedResponse =
        interviewReportSchema.parse(parsedResponse);

    console.log("FINAL AI RESPONSE:", validatedResponse);

    return validatedResponse;
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}
module.exports = {
    generateInterviewReport, generateResumePdf
};

// const { GoogleGenAI } = require("@google/genai")
// const { z } = require("zod")
// const { zodToJsonSchema } = require("zod-to-json-schema")
// // const puppeteer = require("puppeteer")

// const ai = new GoogleGenAI({
//     apiKey: process.env.GOOGLE_GENAI_API_KEY
// })


// const interviewReportSchema = z.object({

//     matchScore: z.number()
//         .min(0)
//         .max(100)
//         .describe(
//             "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
//         ),

//     title: z.string()
//         .describe(
//             "The title of the job for which the interview report is generated"
//         ),

//     technicalQuestions: z.array(
//         z.object({
//             question: z.string()
//                 .describe(
//                     "The technical question that can be asked in the interview"
//                 ),

//             intention: z.string()
//                 .describe(
//                     "The intention of the interviewer behind asking this question"
//                 ),

//             answer: z.string()
//                 .describe(
//                     "How to answer this question, what points to cover, and what approach to take"
//                 )
//         })
//     ).describe(
//         "Technical questions that can be asked in the interview along with their intention and how to answer them"
//     ),

//     behavioralQuestions: z.array(
//         z.object({
//             question: z.string()
//                 .describe(
//                     "The behavioral question that can be asked in the interview"
//                 ),

//             intention: z.string()
//                 .describe(
//                     "The intention of the interviewer behind asking this question"
//                 ),

//             answer: z.string()
//                 .describe(
//                     "How to answer this question, what points to cover, and what approach to take"
//                 )
//         })
//     ).describe(
//         "Behavioral questions that can be asked in the interview along with their intention and how to answer them"
//     ),

//     skillGaps: z.array(
//         z.object({
//             skill: z.string()
//                 .describe(
//                     "The skill which the candidate is lacking"
//                 ),

//             severity: z.enum(["low", "medium", "high"])
//                 .describe(
//                     "The severity of this skill gap and how important it is for the job"
//                 )
//         })
//     ).describe(
//         "List of skill gaps in the candidate's profile along with their severity"
//     ),

//     preparationPlans: z.array(
//         z.object({
//             day: z.number()
//                 .describe(
//                     "The day number in the preparation plan, starting from 1"
//                 ),

//             focus: z.string()
//                 .describe(
//                     "The main focus of this day, such as data structures, system design, or mock interviews"
//                 ),

//             tasks: z.array(z.string())
//                 .describe(
//                     "List of tasks to be completed on this day"
//                 )
//         })
//     ).describe(
//         "A day-wise preparation plan for the candidate"
//     )
// })
// async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


//     const prompt = `Generate an interview report for a candidate with the following details:
//                         Resume: ${resume}
//                         Self Description: ${selfDescription}
//                         Job Description: ${jobDescription}
// `

//     const response = await ai.models.generateContent({
//         model: "gemini-3-flash-preview",
//         contents: prompt,
//         config: {
//             responseMimeType: "application/json",
//             responseSchema: zodToJsonSchema(interviewReportSchema),
//         }
//     })

//     return JSON.parse(response.text)


// }
// async function invokeGeminiAi() {
//     const response = await ai.models.generateContent({
//         model: "gemini-3.7-flash",
//         contents: "Hello gemini ! explain what is js ?"
//     })
//     console.log(response.text);

// }

// module.exports = invokeGeminiAi

// module.exports = { generateInterviewReport }