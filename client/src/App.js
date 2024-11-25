//import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EventPage from './components/Events/EventPage';
import SignInPage from './components/SignIn/SignInPage';
import RegisterPage from './components/Register/RegisterPage';
import EventCard from './components/Events/EventCard';
import Navbar from './components/Navbar/Navbar';
function App() {
  return (
    <Router>
      <Navbar/>
      <div className="App">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/" element={<EventPage />} />
          <Route path="/api/events" element={<EventPage />} />
          <Route path="/test/event" element={<EventCard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
