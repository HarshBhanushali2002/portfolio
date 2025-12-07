import React from "react";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import Docknav from "./components/Docknav";

import { Draggable } from "gsap/Draggable";
import gsap from "gsap";
import Terminal from "./windows/Terminal";
import Safari from "./windows/Safari";
import Portfolio from "./windows/Resume";


gsap.registerPlugin(Draggable);

const App = () => {
  return (
    <main>
      <Navbar />
      <Welcome />
      <Docknav />


      <Terminal />
      <Safari />
      <Portfolio />
    </main>
  );
};

export default App;
