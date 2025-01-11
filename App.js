import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [priceData, setPriceData] = useState(null);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');

  useEffect(() => {
    
    const fetchPriceData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price`,
          {
            params: {
              ids: selectedCoin,
              vs_currencies: 'usd,inr',
              include_24hr_change: true,
            },
          }
        );
        setPriceData(response.data);
      } catch (error) {
        console.error('Error fetching price data:', error);
      }
    };

    fetchPriceData();
  }, [selectedCoin]);

  useEffect(() => {
    
    const fetchTrendingCoins = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/search/trending'
        );
        setTrendingCoins(response.data.coins.slice(0, 3)); 
      } catch (error) {
        console.error('Error fetching trending coins:', error);
      }
    };

    fetchTrendingCoins();
  }, []);

  return (
    <div className="app">
      <header>
        <h1>{selectedCoin.toUpperCase()} Dashboard</h1>
      </header>

      {/* Price Section */}
      <div className="price-section">
        {priceData && priceData[selectedCoin] ? (
          <>
            <h2>Price: ${priceData[selectedCoin].usd}</h2>
            <h3>Price in INR: ₹{priceData[selectedCoin].inr}</h3>
            <p>24H Change: {priceData[selectedCoin].usd_24h_change.toFixed(2)}%</p>
          </>
        ) : (
          <p>Loading price data...</p>
        )}
      </div>

      {/* Chart Section */}
      <div className="chart-section">
        <h2>Price Chart</h2>
        <div id="tradingview-widget-container">
          <iframe
            src={`https://www.tradingview.com/widgetembed/?symbol=${selectedCoin.toUpperCase()}USD&interval=D&theme=light`}
            width="100%"
            height="500"
            frameBorder="0"
            allowTransparency
          ></iframe>
        </div>
      </div>

      {/* Sentiment Section */}
      <div className="sentiment-section">
        <h2>Sentiment</h2>
        <p>Placeholder sentiment data. Replace this with live API data if available.</p>
      </div>

      {/* You May Also Like Section */}
      <div className="you-may-like-section">
        <h2>You May Also Like</h2>
        <div className="carousel">
          {trendingCoins.map((coin) => (
            <div className="carousel-item" key={coin.item.id}>
              <img src={coin.item.small} alt={coin.item.name} />
              <p>{coin.item.name} ({coin.item.symbol.toUpperCase()})</p>
              <p>Price: ${(coin.item.price_btc * priceData?.bitcoin?.usd || 0).toFixed(2)}</p>
              <img src={coin.item.sparkline} alt="Price trend" />
            </div>
          ))}
        </div>
      </div>

      {/* Trending Coins Section */}
      <div className="trending-section">
        <h2>Trending Coins (24h)</h2>
        <ul>
          {trendingCoins.map((coin) => (
            <li key={coin.item.id}>
              <img src={coin.item.small} alt={coin.item.name} />
              <p>{coin.item.name} ({coin.item.symbol.toUpperCase()})</p>
              <p>Rank: {coin.item.market_cap_rank}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;


