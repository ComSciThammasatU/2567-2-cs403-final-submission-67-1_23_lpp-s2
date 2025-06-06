import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { Link, useLocation } from 'react-router-dom';
import './SearchResults.css';

const SearchResults = () => {
  const [filteredResults, setFilteredResults] = useState([]);
  const { searchActivities } = useContext(StoreContext);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';

  const baseURL = 'http://localhost:4000';

  useEffect(() => {
    if (query) {
      const results = searchActivities(query);  // ใช้ฟังก์ชันใน context ที่คืนค่ากิจกรรม
      setFilteredResults(results);
    }
  }, [query, searchActivities]);

  return (
    <div className="search-results-page">
      <h2>ผลการค้นหา: "{query}"</h2>
      <div className="results-list">
        {filteredResults.length > 0 ? (
          filteredResults.map((event) => (
            <div key={event._id} className="result-item">
              <Link to={`/event/${event._id}`} className="result-link">
                <div className="result-details">
                  <img src={`${baseURL}/images/${event.image}`} alt={event.eventName} className="result-image" />
                  <div className="result-text">
                    <p className="result-title">{event.eventName}</p>
                    <p className="result-description">{event.eventDescription.slice(0, 100)}...</p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>ไม่พบกิจกรรมที่ค้นหา</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
