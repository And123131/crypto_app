import { useNavigate } from "react-router-dom";
import PillNav from '../components/PillNav';
import logo from '../assets/logo.png';
import { useState, useEffect } from 'react';
import { getPrediction } from "../api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,    // for x-axis
  LinearScale,      // for y-axis
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Stock() {
  const navigate = useNavigate();
  const [btcPrice, setBtcPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btcHistory, setBtcHistory] = useState({ dates: [], prices: [] });

  useEffect(() => {
    const fetchAndPredict = async () => {
      try {
        // Fetch last 31 BTC prices from backend
        const res = await fetch("http://127.0.0.1:8000/api/last-prices/");
        const data = await res.json();

        const last31Prices = data.prices;
        const last31Dates = data.dates;

        // Get prediction from your backend API
        const pred = await getPrediction(last31Prices);
        setBtcPrice(pred);
        setBtcHistory({
          prices: [...last31Prices, pred],
          dates: [...last31Dates, "Next Day"]
        });

        console.log("Last 31 prices:", last31Prices);
        console.log("Prediction:", pred);

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    // Fetch once immediately
    fetchAndPredict();

    // Set interval to update every minute (60000 ms)
    const intervalId = setInterval(fetchAndPredict, 60000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  const chartData = {
    labels: btcHistory.dates,
    datasets: [
      {
        label: "BTC Price (USDT)",
        data: btcHistory.prices,
        borderColor: "rgba(255, 206, 86, 1)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        tension: 0.3,
      },
    ],
  };

  // Combine BTC with other stocks (only BTC for now)
  const stocks = [
    { name: "BTC", price: btcPrice ? `${btcPrice.toFixed(2)}$` : "Loading..." }
  ];

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <PillNav
          logo={logo}
          logoAlt="Company Logo"
          items={[{ label: 'Home', href: '/' }, { label: 'About Us', href: '/about-us' }]}
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#000000"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
          theme="light"
          initialLoadAnimation={false}
        />
      </div>

      <div className="flex flex-col items-center w-full pt-28">
        <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-400">
            BTC Live Prices & Prediction
          </h2>
          <h3 className="text-xl mb-2 text-white">
            Predicted BTC Price: {btcPrice ? `${btcPrice.toFixed(2)}$` : "Loading..."}
          </h3>
          {!loading && (
            <Line data={chartData} options={{ responsive: true }} />
          )}
        </div>
      </div>
    </>
  );
}

export default Stock;