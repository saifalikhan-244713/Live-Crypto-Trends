// src/App.js
import { useEffect, useState } from "react";
import Dropdown from "./components/Dropdown"; // Assuming you have a Dropdown component for selecting coins

const App = () => {
  const [selectedCoin, setSelectedCoin] = useState("");
  const [liveData, setLiveData] = useState("");
  const [socket, setSocket] = useState(null);
  
  const options = ["ETH/USDT", "BNB/USDT", "DOT/USDT"];

  useEffect(() => {
    // Clean up the previous socket connection
    if (socket) {
      socket.close();
    }

    if (selectedCoin) {
      const newSocket = new WebSocket(
        `wss://stream.binance.com:9443/ws/${selectedCoin
          .toLowerCase()
          .replace("/", "")}@trade`
      );

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const price = data.p; // The latest price of the selected coin
        setLiveData((prevData) =>
          prevData ? `${prevData} | ${price}` : `${price}`
        ); // Add space and pipe to separate values
      };

      // so we can use it to close the socket
      setSocket(newSocket);
    }

    return () => {
      // Clean up on component unmount or when the selected coin changes
      if (socket) {
        socket.close();
      }
    };
  }, [selectedCoin]);

  return (
    <div>
      <h1>Binance Live Coin Rates</h1>
      {/* Dropdown to select a coin */}
      <Dropdown options={options} onSelect={setSelectedCoin} />
      {selectedCoin && (
        <div>
          <h2>{selectedCoin} Live Rate</h2>
          {/* Show the live data */}
          <p style={{ margin: "20px 0", fontSize: "18px", fontWeight: "bold" }}>
            {liveData}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
