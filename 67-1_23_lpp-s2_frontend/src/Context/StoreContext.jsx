import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { menu_list } from "../assets/assets.js";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [event_list, setEventList] = useState([]);
  
  const [token, setToken] = useState("");

  const url = "https://tu-event-backend.onrender.com";

  

 

  const fetchEventList = async () => {
    try {
      const response = await axios.get(`${url}/api/events/events`);
      setEventList(response.data);
    } catch (error) {
      console.error("Error fetching event list:", error);
    }
  };

  const searchActivities = (query) => {
    return event_list.filter(item =>
      item.eventName.toLowerCase().includes(query.toLowerCase()) ||
      item.eventDescription.toLowerCase().includes(query.toLowerCase())
    );
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchEventList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) setToken(savedToken);
    };
    loadData();
  }, []);

  const contextValue = {
    event_list,
    menu_list,

    searchActivities,
    token,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
