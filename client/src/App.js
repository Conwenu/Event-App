//import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EventsPage from './components/Events/EventsPage';
import EventPage from './components/Events/EventPage';
import SignInPage from './components/SignIn/SignInPage';
import RegisterPage from './components/Register/RegisterPage';
import EventCard from './components/Events/EventCard';
// import Navbar from './components/Navbar/Navbar';
import Navbar2 from './components/Navbar/Navbar2';
import UserProfile from './components/UserProfile/UserProfile';
function App() {
  return (
    <Router>
      {/* <Navbar/> */}
      <div className='nav-container'>
        <Navbar2></Navbar2>
      </div>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/" element={<EventsPage />} />
          <Route path="/api/events" element={<EventsPage />} />
          <Route path="/api/events/:eventId" element={<EventPage />} />
          <Route path="/test/event" element={<EventCard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
