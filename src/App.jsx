import React from "react";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import Docknav from "./components/Docknav";

const App = () => {
  return (
    <main>
      <Navbar />
      <Welcome />

      <Docknav />
    </main>
  );
};

export default App;
