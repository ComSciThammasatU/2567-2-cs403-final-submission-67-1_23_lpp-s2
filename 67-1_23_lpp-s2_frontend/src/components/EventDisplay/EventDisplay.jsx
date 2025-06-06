import React, { useContext } from 'react'
import './EventDisplay.css'
import EventItem from '../EventItem/EventItem'
import { StoreContext } from '../../Context/StoreContext'

const EventDisplay = ({category}) => {

  const { event_list } = useContext(StoreContext);

  const baseURL = 'http://localhost:4000';


  return (
    <div className='food-display' id='food-display'>
      <h2>งานกิจกรรมใกล้คุณ</h2>
      <div className='food-display-list'>
      {event_list.map((item) => {
      if (category === "All" || category === item.category) {
        return (
          <EventItem
            key={item._id}
            id={item._id}
            image={`${baseURL}/images/${item.image}`}
            name={item.eventName}
            desc={item.eventDescription}
            date={item.eventDate}
            location={item.location}
            category={item.category}
          />
          );
        }
      })}
      </div>
    </div>
  )
}

export default EventDisplay