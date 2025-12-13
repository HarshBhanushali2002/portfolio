import WindowControls from "@/components/WindowControls";
import WindowWrapper from "@/hoc/WindowWrapper";
import useWindowStore from "@/store/window";
import React from "react";

const Text = ({ onClose, onMinimize, data }) => {
  const { windows } = useWindowStore();
  const fileData = data || windows.txtfile.data;

  if (!fileData) return null;

  const { name, icon, subtitle, description } = fileData;

  return (
    <>
      <div id="window-header">
        <WindowControls target="txtfile" onClose={onClose} onMinimize={onMinimize} />
        <h2>{name}</h2>
      </div>
      <div className="p-6 space-y-4">
        {icon && <img src={icon} alt={name} className="w-12 mb-2" />}
        {subtitle && <h3 className="font-semibold text-lg mb-2">{subtitle}</h3>}
        {Array.isArray(description) && description.map((p, i) => (
          <p key={i} className="text-gray-700 text-base">{p}</p>
        ))}
      </div>
    </>
  );
};

const TextWindow = WindowWrapper(Text, "txtfile");

export default TextWindow;
