//import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EventPage from './components/Events/EventPage';
import SignInPage from './components/SignIn/SignInPage';
import RegisterPage from './components/Register/RegisterPage';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/api/events" element={<EventPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
