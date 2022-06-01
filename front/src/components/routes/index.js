import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Log from "../../pages/log";
import Home from "../../pages/home";

const index = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Log />} />
        <Route path="/home" exact element={<Home />} />
      </Routes>
    </Router>
  );
};

export default index;
