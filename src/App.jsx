import React, { useState } from "react";

const App = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer Your_API_Key",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [{ role: "user", content: input }],
        }),
      });

      if (!res.ok) throw new Error("API Failed...");

      const data = await res.json();
      setLoading(false);
      setResponse(data.choices[0].message.content);
    } catch (error) {
      setLoading(false);
      setResponse("Something went wrong");
    } finally {
      setInput("");
    }
  };
  return (
    <div>
      <h2>AI Interview App</h2>
      <input
        className="padding"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="padding marginLeft" disbaled={loading} onClick={askAI}>
        {loading ? "Loading..." : "Ask AI"}
      </button>
      <p>{response}</p>
    </div>
  );
};

export default App;
