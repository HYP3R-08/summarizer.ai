import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Spinner from "./ui/Spinner.jsx";

// Split the heavier routes (Supabase, PDF extraction) out of the initial bundle.
const Login = lazy(() => import("./Login.jsx"));
const SignIn = lazy(() => import("./SignIn.jsx"));
const Summarizer = lazy(() => import("./Summarizer.jsx"));

function RouteFallback() {
  return (
    <div className="min-h-screen flex-center">
      <Spinner className="!w-8 !h-8" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignIn />} />
          <Route path="/summarizer" element={<Summarizer />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
