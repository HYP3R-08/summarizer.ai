import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import SignIn from "./SignIn.jsx";
import Summarizer from "./Summarizer.jsx";

function App() {

  
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignIn />}/>
        <Route path="/summarizer" element={<Summarizer />}/>
      </Routes>
    </Router>
  )
}

export default App