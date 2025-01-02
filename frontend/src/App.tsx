import { useEffect, useState } from "react";
import socketWorker from "./utils/SocketIOWrapper";
import "./App.css";

function App() {
  const [pongsReceived, setPongsReceived] = useState<string[]>([]);
  useEffect(() => {
    const handleMessage = (data: { uuid: string }) => {
      console.log("Message received:", data);
      setPongsReceived((c) => [
        ...c,
        `${new Date().toLocaleString()} - ${data.uuid}`,
      ]);
    };

    socketWorker.on("pong", handleMessage);

    return () => {
      socketWorker.off("pong", handleMessage);
    };
  }, []);

  const sendMessage = () => {
    socketWorker.emit("ping", { message: "Hello from React uwu" });
  };

  return (
    <div>
      <button onClick={sendMessage}>Send ping to server</button>
      <ul>
        {pongsReceived.map((pong, id) => {
          return <li key={id}>{pong}</li>;
        })}
      </ul>
    </div>
  );
}

export default App;
