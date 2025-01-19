import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EventsPage from './components/Events/EventsPage';
import EventPage from './components/Events/EventPage';
import SignInPage from './components/SignIn/SignInPage';
import RegisterPage from './components/Register/RegisterPage';
import EventCard from './components/Events/EventCard';
import AuthNavbar from './components/Navbar/AuthNavbar';
import NonAuthNavbar from './components/Navbar/NonAuthNavbar';
import UserProfile from './components/UserProfile/UserProfile';
import RequireAuth from './components/RequireAuth/RequireAuth';
import PersistLogin from './components/PersistLogin/PersistLogin';
function App() {

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for saved theme preference on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle the theme and save it to localStorage
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };


  return (
    <Router>
      {/* <Navbar/> */}
      <div className='nav-container'>
        {/* <NonAuthNavbar toggleTheme={toggleTheme} isDarkMode={isDarkMode}/> */}
        <AuthNavbar toggleTheme={toggleTheme} isDarkMode={isDarkMode}/>
        {/* <Navbar2 toggleTheme={toggleTheme} isDarkMode={isDarkMode}/> */}
      </div>
      <div className="App">
        <Routes>
          {/* <Route path="/" element={<EventsPage />} />
          <Route path="/signup" element={<RegisterPage />} /> */}
          <Route path="/login" element={<SignInPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventPage />} />
          <Route path="/test/event" element={<EventCard />} />
          <Route element={<PersistLogin/>}>
            <Route element = {<RequireAuth/>}>
              <Route path="/" element={<EventsPage />} />
              <Route path="/signup" element={<RegisterPage />} />
              <Route path="/profile/:tabId/:userId/:innerTabId" element={<UserProfile />} />
            </Route>
          </Route>
          {/* Create a catch all route */}
          {/* <Route path="*" element={<></>}/> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
