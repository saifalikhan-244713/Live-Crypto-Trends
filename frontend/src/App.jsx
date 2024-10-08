import { useEffect, useState } from "react";
import Dropdown from "./components/Dropdown";
import { LineGraph } from "./components/LineGraph";

const App = () => {
  const [selectedCoin, setSelectedCoin] = useState("");
  const [liveData, setLiveData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Live Coin Price",
        data: [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  });

  const [socket, setSocket] = useState(null);

  const options = ["ETH/USDT", "BNB/USDT", "DOT/USDT"];

  useEffect(() => {
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
        const price = parseFloat(data.p);

        // Update the live data for the chart
        setLiveData((prevData) => [
          ...prevData.slice(-19), // Keep latest 20 data points
          price,
        ]);

        setChartData((prevData) => ({
          ...prevData,
          labels: [
            ...prevData.labels.slice(-19),
            new Date().toLocaleTimeString(),
          ],
          datasets: [
            {
              ...prevData.datasets[0],
              data: [...prevData.datasets[0].data.slice(-19), price],
            },
          ],
        }));
      };

      setSocket(newSocket);
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [selectedCoin]);

  return (
    <div>
      <h1>Binance Live Coin Rates</h1>
      <Dropdown options={options} onSelect={setSelectedCoin} />

      {selectedCoin && (
        <div>
          <h2>{selectedCoin} Live Rate</h2>
          <p style={{ margin: "20px 0", fontSize: "18px", fontWeight: "bold" }}>
            {liveData[liveData.length - 1]}
          </p>
          <LineGraph data={chartData} />
        </div>
      )}
    </div>
  );
};

export default App;
