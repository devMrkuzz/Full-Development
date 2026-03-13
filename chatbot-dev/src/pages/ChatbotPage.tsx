import { useState } from "react";

export default function ChatbotPage() {
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([]);

  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [...prev, { sender: "user", text: userText }]);

    setInput("");

    try {
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          sessionId: sessionId || undefined,
        }),
      });

      const data = await res.json();

      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.botReply || data.message || "No reply from server.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Failed to connect to chatbot server" },
      ]);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>AskSorSU Chatbot</h1>

      {/* Chat window */}
      <div
        style={{
          border: "1px solid #ccc",
          height: "400px",
          padding: "20px",
          marginBottom: "20px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <strong>{msg.sender === "user" ? "You: " : "Bot: "}</strong>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "70%", padding: "10px", marginRight: "10px" }}
      />

      {/* Send button */}
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
