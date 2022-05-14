import axios from "axios";
import React, { useState, useEffect } from "react";

export default function App() {
  const [searchVal, setSearchVal] = useState("");
  const [userToken, setUserToken] = useState(null);
  const [timeOutId, setTimeOutId] = useState(null);
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    fetchUserToken();
  }, []);

  const fetchUserToken = async () => {
    const data = await axios({
      method: "GET",
      url: "http://3.108.244.88:5000/api/user-access-token",
    });
    setUserToken(data.data?.token);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (value.trim() === "") {
      setStockData([]);
      setSearchVal(value);
      return;
    }
    setSearchVal(value);
    clearTimeout(timeOutId);
    if (value.trim() === searchVal.trim()) return;
    const newTimeOutId = setTimeout(() => {
      fetchStockValue(value);
    }, 500);
    setTimeOutId(newTimeOutId);
  };

  const fetchStockValue = async (search) => {
    const params = {
      search_string: search,
    };
    const headers = {
      "user-access-token": userToken,
    };
    const data = await axios({
      method: "GET",
      url: "http://3.108.244.88:5000/api/data",
      params,
      headers,
    });
    setStockData(data.data);
  };

  return (
    <div>
      <input name="search" value={searchVal} onChange={handleChange} />
      <ul>
        {stockData.map((stock) => {
          return (
            <li key={stock[0]}>
              <h2>{`Name: ${stock[0]}`}</h2>
              <h2>{`NSE: ${stock[1]}`}</h2>
              <h2>{`BSE: ${stock[2]}`}</h2>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
