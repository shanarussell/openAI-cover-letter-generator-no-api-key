import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const jobInput = req.body.jobInput || "";
  const resumeInput = req.body.resumeInput || "";
  const companyName = req.body.companyName || "";
  const yourName = req.body.yourName || "";
  const jobTitle = req.body.jobTitle || "";
  const alsoInclude = req.body.alsoInclude || "";

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(
        jobInput,
        resumeInput,
        companyName,
        yourName,
        jobTitle,
        alsoInclude
      ),
      temperature: 0.6,
      max_tokens: 1024,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(
  jobInput,
  resumeInput,
  companyName,
  yourName,
  jobTitle,
  alsoInclude
) {
  return `Create a cover letter for a job with the tile of ${jobTitle} with this company: ${companyName}. Here is the description of the skills needed for the job: ${jobInput} My name is ${yourName} and these are the skills from my resume: ${resumeInput}. Also include this extra information: ${alsoInclude}`;
}
