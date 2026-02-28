import React, { useState }from 'react'

const App = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const askAI = async () => {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization:
          "Bearer Your_API_Key",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: input }],
      }),
    });

    const data = await res.json();
    setResponse(data.choices[0].message.content);
  };
  return (
    <div>
      <h2>AI Interview App</h2>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={askAI}>Ask</button>
      <p>{response}</p>
    </div>
  );
}

export default App
