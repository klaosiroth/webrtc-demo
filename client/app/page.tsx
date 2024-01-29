"use client";

import { useState, useEffect } from "react";
import { socket } from "./socket";
import styles from "./page.module.css";

export default function Home() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState<any[]>([]);

  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   // no-op if the socket is already connected
  //   socket.connect();

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value: any) {
      setFooEvents((previous) => [...previous, value]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("foo", onFooEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("foo", onFooEvent);
    };
  }, [fooEvents]);

  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  function onSubmit(event: any) {
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(5000).emit("create-something", value, () => {
      setIsLoading(false);
    });
  }

  return (
    <main className={styles.main}>
      <h2>WebRTC Demo</h2>
      <p>State: {"" + isConnected}</p>
      <div>
        <button onClick={connect}>Connect</button>
        <button onClick={disconnect}>Disconnect</button>
      </div>

      <ul>
        {fooEvents.map((event, index) => (
          <li key={index}>{event}</li>
        ))}
      </ul>

      <form onSubmit={onSubmit}>
        <input onChange={(e) => setValue(e.target.value)} />
        <button type="submit" disabled={isLoading}>
          Submit
        </button>
      </form>
    </main>
  );
}
