import { locations } from "@/constants";
import useLocationStore from "@/store/location";
import useWindowStore from "@/store/window";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import { Draggable } from "gsap/Draggable";
import React from "react";

const projects = locations.work?.children ?? [];

const Home = () => {
  const { setActiveLocation } = useLocationStore();
  const { openWindow } = useWindowStore();

  const handleOpenProjFinder = (proj) => {
    setActiveLocation(proj);
    openWindow("finder");
  };

  useGSAP(() => {
    Draggable.create(".folder");
  }, []);

  return (
    <section id="home">
      <ul>
        {projects.map((proj) => (
          <li
            key={proj.id}
            className={clsx("group folder", proj.windowPosition)}
            onClick={() => handleOpenProjFinder(proj)}
          >
            <img src="/images/folder.png" alt={proj.name} />
            <p>{proj.name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Home;
