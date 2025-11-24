import useWindowStore from "@/store/window";
import React from "react";

const WindowControls = ({ target, onClose, onMinimize }) => {
  const maximizeWindow = useWindowStore((state) => state.maximizeWindow);

  return (
    <div id="window-controls">
      <div className="close" onClick={onMinimize ? () => onMinimize(target) : undefined} />
      <div className="maximize" onClick={() => maximizeWindow(target)} />
      <div className="minimize" onClick={onMinimize ? () => onMinimize(target) : undefined} />
    </div>
  );
};

export default WindowControls;
