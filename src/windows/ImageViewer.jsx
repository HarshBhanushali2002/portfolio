import WindowControls from "@/components/WindowControls";
import WindowWrapper from "@/hoc/WindowWrapper";
import useWindowStore from "@/store/window";
import React from "react";

const ImageViewer = ({ onClose, onMinimize, data }) => {
  const { windows } = useWindowStore();
  const fileData = data || windows.imgfile.data;

  if (!fileData) return null;

  const { name, imageUrl, icon, subtitle, description } = fileData;

  return (
    <>
      <div id="window-header">
        <WindowControls target="imgfile" onClose={onClose} onMinimize={onMinimize} />
        <p>{name}</p>
      </div>
      <div className="preview p-6 space-y-4 flex flex-col items-center">
        {imageUrl && (
          <img src={imageUrl} alt={name} className="max-h-96 rounded mb-2" />
        )}
        {icon && !imageUrl && (
          <img src={icon} alt={name} className="w-12 mb-2" />
        )}
        {subtitle && <h3 className="font-semibold text-lg mb-2">{subtitle}</h3>}
        {Array.isArray(description) && description.map((p, i) => (
          <p key={i} className="text-gray-700 text-base">{p}</p>
        ))}
      </div>
    </>
  );
};

const ImageViewerWindow = WindowWrapper(ImageViewer, "imgfile");

export default ImageViewerWindow;
