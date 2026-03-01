import React, { useState } from "react";

const App = () => {
  const [input, setInput] = useState("");
  // const [response, setResponse] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer Your_API_Key",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `
You are a frontend technical interviewer.
Ask ONLY ONE question at a time.
Wait for user's answer before asking next question.
Keep responses short.
`,
            },
            ...messages,
            userMessage,
          ],
        }),
      });

      if (!res.ok) throw new Error("API Failed...");

      const data = await res.json();
      setLoading(false);
      const aiMessage = {
        role: "assistant",
        content: data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setResponse(data.choices[0].message.content);
    } catch (error) {
      setLoading(false);
      setResponse("Something went wrong");
    } finally {
      setInput("");
    }
  };
  return (
    <div className="parentDiv">
      <h2 className="marginLeft8EM">AI Interview App</h2>
      <input
        className="padding marginLeft8EM"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="padding marginLeft" disbaled={loading} onClick={askAI}>
        {loading ? "Loading..." : "Ask AI"}
      </button>
      <div className="chat-container">
        {messages.map((message, index) => (
          <p
            key={index}
            className={message.role === "user" ? "user-msg" : "ai-msg"}
          >
            {message.content}
          </p>
        ))}
      </div>
    </div>
  );
};

export default App;
