import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ChatDashboard.css";

function ChatDashboard() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [number, setNumber] = useState("+918747078268");
    const [isLoading, setIsLoading] = useState(false);

    // Poll for new messages every 3 seconds
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:5000/api/messages/history");
                const history = res.data.flatMap(chat => [
                    { sender: "user", text: chat.userMessage },
                    { sender: "bot", text: chat.botResponse }
                ]);
                setMessages(history);
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };

        fetchHistory(); // Initial fetch
        const interval = setInterval(fetchHistory, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, []);

    const sendMessage = async () => {
        if (!input) return;

        // Optimistic UI update
        setMessages(prev => [...prev, { sender: "user", text: input }]);
        setIsLoading(true);

        try {
            // Send message
            const res = await axios.post("http://127.0.0.1:5000/api/messages/send", {
                message: input,
                userNumber: number || "DEMO"
            });
            // Note: Polling will pick up the saved message eventually, but we update UI immediately for better UX
            // We don't need to add bot response manually if polling is fast, but let's keep it for responsiveness
            // Actually, if we poll, we might get duplicates if we aren't careful. 
            // For MVP, simplest is to just let polling handle the "truth" or just append response. 
            // Let's rely on polling for the "truth" to avoid duplicates if we re-fetch history.
            // Wait, if we fetch history, it replaces the entire state. So we don't need to manual setMessages(prev => ...bot) technically.
            // But let's keep manual set for instant feedback, and the next poll will overwrite it with the DB state.
            setMessages(prev => [...prev, { sender: "bot", text: res.data.botResponse }]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMsg = error.response
                ? `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`
                : `Network Error: ${error.message}. Is Backend running?`;
            setMessages(prev => [...prev, { sender: "bot", text: errorMsg }]);
        } finally {
            setIsLoading(false);
            setInput("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Gemini WhatsApp Bot</h2>
                <input
                    className="phone-input"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="WhatsApp Number (optional)"
                />
            </div>

            <div className="messages-area">
                {messages.length === 0 && <div className="welcome-text">Start a conversation!</div>}
                {messages.map((msg, i) => (
                    <div key={i} className={`message ${msg.sender}`}>
                        <div className="message-content">
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && <div className="message bot"><div className="message-content">Thinking...</div></div>}
            </div>

            <div className="input-area">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    disabled={isLoading}
                />
                <button onClick={sendMessage} disabled={isLoading || !input}>
                    {isLoading ? "..." : "Send"}
                </button>
            </div>
        </div>
    );
}

export default ChatDashboard;
