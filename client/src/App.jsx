import React from 'react';
import './App.css';

const App = () => {

  const socket = React.useMemo(() => new WebSocket('wss://0o8ik0qlcg.execute-api.ap-south-1.amazonaws.com/dev'), []);
  const [text, setText] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const userId = React.useMemo(() => Math.floor(Math.random() * Number(Date.now().toString())), []);
  const messagesContainerRef = React.useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    socket?.send(JSON.stringify({ userId, text }));
    setText('');
  };

  React.useEffect(() => {
    if (!socket) return;
    socket.onmessage = (e) => {
      setMessages((prev) => [JSON.parse(e.data), ...prev]);
    };
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  }, [socket, messages]);

  return (
    <div className="container">
      <div className="chat-container">
        <div ref={messagesContainerRef} className="messages-container">
          {messages.length === 0 ? (
            <p className="empty-message">No messages yet. Start the conversation!</p>
          ) : (
            messages.map((message, index) => (
              <div
                className={`message ${userId === message?.userId ? 'own-message' : 'other-message'}`}
                key={index}
              >
                {message?.text}
              </div>
            ))
          )}
        </div>
        <form className="form" onSubmit={onSubmit}>
          <input
            className="input"
            type="text"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter message here.."
          />
          <button className="button" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
