import React from "react";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import Docknav from "./components/Docknav";

import { Draggable } from "gsap/Draggable";
import gsap from "gsap";
import Terminal from "./windows/Terminal";
import Safari from "./windows/Safari";
import Portfolio from "./windows/Resume";
import Finder from "./windows/Finder";
import { Text, ImageViewer } from "./windows";
import Contact from "./windows/Contact";
import Home from "./components/Home";
import Photos from "./windows/Photos";

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

      <Finder />
      <Text />
      <ImageViewer />
      <Contact />
      <Photos/>

      <Home/>
    </main>
  );
};

export default App;
