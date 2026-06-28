const RunwayML = require("@runwayml/sdk").default;
const { TaskFailedError } = require("@runwayml/sdk");
console.log(process.env.RUNWAY_API_KEY);

const client = new RunwayML({
  apiKey: process.env.RUNWAY_API_KEY,
});

const generateVideoFromPrompt = async (prompt) => {
  try {
    if (!process.env.RUNWAY_API_KEY) {
      console.error("RUNWAY_API_KEY is not set.");
      return { success: false };
    }

    const task = await client.imageToVideo
      .create({
        model: "gen4.5",
        promptText: prompt,
        ratio: "1280:720",
        duration: 5,
      })
      .waitForTaskOutput();

    return {
      success: true,
      videoUrl: task.output[0],
    };
  } catch (error) {
    if (error instanceof TaskFailedError) {
      console.error("Runway task failed:", error.taskDetails);
    } else {
      console.error("Runway Error:", error);
    }

    return {
      success: false,
    };
  }
};

module.exports = {
  generateVideoFromPrompt,
};