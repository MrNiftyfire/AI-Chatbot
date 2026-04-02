import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-3.5-turbo" if you want to test
      messages: [
        {
          role: "system",
          content: `
You are a website assistant.

Help users:
- Navigate the site
- Find pages
- Answer simply

Keep answers short and helpful.
`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    return res.status(200).json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    if (error.response) {
      console.error("OPENAI ERROR STATUS:", error.response.status);
      console.error("OPENAI ERROR DATA:", error.response.data);
    } else {
      console.error("ERROR:", error);
    }

    return res.status(500).json({ error: "Server error, check logs" });
  }
}
