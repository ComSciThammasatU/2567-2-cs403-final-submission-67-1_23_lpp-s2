import React, { useState } from 'react'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'

import LoginPopup from './components/LoginPopup/LoginPopup'


import CreateActivity from './pages/CreateActivity/CreateActivity'

import SearchResults from './pages/SearchResults/SearchResults'; // เพิ่มการนำเข้า SearchResults
import EventDetail from './pages/EventDetail/EventDetail'
import HistoryPage from './pages/HistoryPage/HistoryPage'
import MyEventsPage from './pages/MyEventsPage/MyEventsPage'
import RegisteredEventsPage from './pages/RegisteredEventsPage/RegisteredEventsPage'
import EditProfilePage from './pages/EditProfilePage/EditProfilePage'
import ScanTicket from './components/ScanTicket/ScanTicket'
import EventRegistrationsPage from './pages/EventRegistrationsPage/EventRegistrationsPage'
import EventRatingsPage from './pages/EventRatingsPage/EventRatingsPage'

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : null}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
        <Route path='' element={<Home key={window.location.pathname}/>} />
          <Route path='/' element={<Home key={window.location.pathname}/>} />
          <Route path="/home" element={<Home key={window.location.pathname}/>} />

          <Route path='/create-activity' element={<CreateActivity key={window.location.pathname}/>} />

          <Route path="/event/:eventId" element={<EventDetail key={window.location.pathname}/>} />
          <Route path="/history" element={<HistoryPage key={window.location.pathname}/>} />
          <Route path="/my-events" element={<MyEventsPage key={window.location.pathname}/>} />
          <Route path="/registered-events" element={<RegisteredEventsPage key={window.location.pathname}/>} />
          <Route path="/edit-profile" element={<EditProfilePage key={window.location.pathname}/>} />
          <Route path="/scan-ticket/:eventId" element={<ScanTicket key={window.location.pathname}/>} />
          <Route path="/event-registrations/:eventId" element={<EventRegistrationsPage key={window.location.pathname}/>} />
          <Route path="/event/:eventId/ratings" element={<EventRatingsPage key={window.location.pathname}/>} />

          <Route path='/search' element={<SearchResults key={window.location.pathname}/>} /> {/* เพิ่มเส้นทางสำหรับ SearchResults */}
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;