import React, { useEffect, useState } from "react";

const App = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = React.useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
    console.log("Bottom ref:", bottomRef);
    console.log("Messages updated:", messages);
  }, [messages]);

  const askAI = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

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
    <div className="app-container">
      <div className="chat-card">
        <div className="header">
          <h2>AI Interview App</h2>
        </div>

        <div className="chat-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={
                message.role === "user" ? "message user-msg" : "message ai-msg"
              }
            >
              {message.content}
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        <div className="input-section">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer..."
          />
          <button disabled={loading} onClick={askAI}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
