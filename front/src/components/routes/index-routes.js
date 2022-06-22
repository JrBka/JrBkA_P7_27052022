import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Log from "../../pages/log-pages";
import Home from "../../pages/home-pages";
import Error from "../error/index-error";

const Index = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Log />} />
        <Route path="/home" exact element={<Home />} />
        <Route path="*" exact element={<Error />} />
      </Routes>
    </Router>
  );
};

export default Index;
