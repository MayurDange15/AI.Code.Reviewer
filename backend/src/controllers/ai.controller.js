import aiService from "../services/ai.services.js";

const getResponse = async (req, res) => {
  const prompt = req.body.code;

  if (!prompt) {
    return res.status(400).send("Prompt is required");
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  try {
    const stream = await aiService(prompt);
    // IMPORTANT: aiService must RETURN stream, not final text

    for await (const chunk of stream) {
      const text = chunk.text || "";
      res.write(text);
    }

    res.end();
  } catch (err) {
    console.error("Controller Error:", err.message);
    // Send a 500 status and pass the specific error message to the frontend
    res.status(500).json({ error: err.message || "Error generating response" });
  }
};

export default getResponse;
