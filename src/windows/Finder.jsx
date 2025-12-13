import WindowControls from "@/components/WindowControls";
import { locations } from "@/constants";
import WindowWrapper from "@/hoc/WindowWrapper";
import useLocationStore from "@/store/location";
import useWindowStore from "@/store/window";
import clsx from "clsx";
import { Search } from "lucide-react";
import React from "react";

const Finder = ({ onClose, onMinimize, data }) => {
  const { openWindow } = useWindowStore();
  const { activeLocation, setActiveLocation } = useLocationStore();
  const animationSource = data?.source || "navbar";

  const renderList = (items) =>
    items.map((item) => (
      <li
        key={item.id}
        className={clsx(
          item.id === activeLocation.id ? "active" : "not-active"
        )}
        onClick={() => setActiveLocation(item)}
      >
        <img src={item.icon} alt={item.name} className="w-4" />
        <p className="text-sm font-medium truncate">{item.name}</p>
      </li>
    ));

  const openItem = (item) => {
    if (item.fileType === "pdf") {
      return openWindow("resume");
    }
    if (item.kind === "folder") {
      return setActiveLocation(item);
    }

    if (["fig", "url"].includes(item.fileType) && item.href) {
      return window.open(item.href, "_blank");
    }

    if (item.fileType === "txt") {
      return openWindow("txtfile", item);
    }

    if (item.fileType === "img") {
      return openWindow("imgfile", item);
    }

    openWindow(`${item.fileType} ${item.href}`, item);
  };

  return (
    <>
      <div id="window-header">
        <WindowControls target="finder" onClose={onClose} onMinimize={onMinimize}/>
        <Search className="icon" />
      </div>

      <div className={clsx("bg-white flex h-full", `animate-from-${animationSource}`)}>
        <div className="sidebar">
          <div>
            <h3>Favourites</h3>
            <ul>{renderList(Object.values(locations))}</ul>
          </div>

          <div>
            <h3>My Projects</h3>
            <ul>{renderList(locations.work.children)}</ul>
          </div>
        </div>

        <ul className="content">
          {activeLocation?.children.map((item) => (
            <li
              key={item.id}
              className={clsx(item.position, "cursor-pointer")}
              onClick={() => openItem(item)}
            >
              <img
                src={item.icon}
                alt={item.name}
                className="hover:scale-110 transition-transform duration-200 "
              />
              <p>{item.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;
