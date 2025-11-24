import React from "react";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import Docknav from "./components/Docknav";

import { Draggable } from "gsap/Draggable";
import gsap from "gsap";
import Terminal from "./windows/Terminal";


gsap.registerPlugin(Draggable);

const App = () => {
  return (
    <main>
      <Navbar />
      <Welcome />
      <Docknav />


      <Terminal />
    </main>
  );
};

export default App;
