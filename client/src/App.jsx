import React from 'react';

const App = () => {

  const [messages, setMessages] = React.useState([]);
  const [text, setText] = React.useState('');
  const socket = React.useMemo(() => new WebSocket('wss://0o8ik0qlcg.execute-api.ap-south-1.amazonaws.com/dev'), []);

  React.useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages([...messages, data?.message]);
    };
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    socket.send(text);
    setText('');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="input"
        />
        <button type="submit" className="button">
          Send
        </button>
      </form>
      <div>
        {messages?.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </>
  );
};

export default App;