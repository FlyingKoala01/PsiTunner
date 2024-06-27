import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './Homepage';
import Navbar from './Navbar';
import Documentation from './Documentation';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/documentation" element={<Documentation />} />
      </Routes>
    </Router>
  );
}
