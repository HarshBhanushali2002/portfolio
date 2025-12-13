import WindowControls from "@/components/WindowControls";
import { socials } from "@/constants";
import WindowWrapper from "@/hoc/WindowWrapper";
import React from "react";

const Contact = ({ onClose, onMinimize }) => {
  return (
    <>
      <div id="window-header">
        <WindowControls
          target="contact"
          onClose={onClose}
          onMinimize={onMinimize}
        />
        <h2>Contact Me!</h2>
      </div>

      <div className="p-5 space-y-5">
        <img
          src="/images/adrian.jpg"
          alt="Adrain"
          className="w-20 rounded-full"
        />

        <h3>Let's Connect</h3>
        <p>Got an idea? Abug to squash? Or just wanna talk tech? I'm in.</p>
        <p>bhanushaliharsh1@gmail.com</p>
        <ul>
          {socials.map(({ id, bg, link, icon, text }) => (
            <li key={id} style={{ backgroundColor: bg }}>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                title={text}
              >
                <img src={icon} alt={text} className="size-5" />
                <p>{text}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const ContactWindow = WindowWrapper(Contact, "contact");

export default ContactWindow;
