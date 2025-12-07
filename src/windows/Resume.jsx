import WindowControls from "@/components/WindowControls";
import WindowWrapper from "@/hoc/WindowWrapper";
import { Download, Wind } from "lucide-react";
import React from "react";
import { Document, Page , pdfjs} from 'react-pdf';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const Resume = ({ onClose, onMinimize }) => {
  return (
    <>
      <div id="window-header">
        <WindowControls
          target="resume"
          onClose={onClose}
          onMinimize={onMinimize}
        />
        <h2>Resume.pdf</h2>

        <a
          href="/files/HarshBhanushaliCV2025.pdf"
          download
          className="cursor-pointer"
          title="Download Resume"
        >
          <Download className="icon" />
        </a>
      </div>

      <Document file="/files/HarshBhanushaliCV2025.pdf">
        <Page pageNumber={1} renderTextLayer renderAnnotationLayer />
      </Document>
    </>
  );
};

const ResumeWindow = WindowWrapper(Resume, "resume");

export default ResumeWindow;
