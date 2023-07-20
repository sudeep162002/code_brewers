import "../StyleSheets/TypingHome.css";

import React from "react";

const TypingHome = () => {
  return (
    <>
      <div className="home-navbar-container">
        <div className="home-navbar-left-container">
          <a href="/">Typing Test</a>
        </div>
        <div className="home-navbar-right-container">
          <p>Home</p>
          <p>About</p>
          <p>Contact Us</p>
        </div>
      </div>
    </>
  );
};

export default TypingHome;
