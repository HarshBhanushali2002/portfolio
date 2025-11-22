import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef } from "react";

const FONT_WEIGHT_SETTINGS = {
  title: { min: 400, max: 800, default: 400 },
  subtitle: { min: 100, max: 400, default: 100 },
};

const renderText = ({ text, className, baseWeight = 400 }) => {
  return [...text].map((char, index) => (
    <span
      key={index}
      className={className}
      style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

const setupTextHover = (container, type) => {
  if (!container) return () => {};

  const letters = container.querySelectorAll("span");

  const { min, max, default: base } = FONT_WEIGHT_SETTINGS[type];
  const animateLetter = (letter, weight, duration = 0.25) => {
    return gsap.to(letter, {
      duration: duration,
      fontVariationSettings: `'wght' ${weight}`,
      ease: "power2.out",
    });
  };

  const handleMouseMove = (event) => {
    const { left } = container.getBoundingClientRect();
    const mouseX = event.clientX - left;

    letters.forEach((letter, index) => {
      const { width, left: l } = letter.getBoundingClientRect();
      const distance = Math.abs(mouseX - (l - left + width / 2));
      const intensity = Math.exp(-(distance ** 2) / 20000);

      animateLetter(letter, min + (max - min) * intensity);
    });
  };

  const handleMouseLeave = () =>
    letters.forEach((letter) => {
      animateLetter(letter, base, 0.3);
    });

  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("mouseleave", handleMouseLeave);
  };
};

const Welcome = () => {
  const titleRef = useRef(null);
  const subTitleRef = useRef(null);

  useGSAP(() => {
    const titleCleanup = setupTextHover(titleRef.current, "title");
    const subTitleCleanup = setupTextHover(subTitleRef.current, "subtitle");

    return () => {
      titleCleanup();
      subTitleCleanup();
    };
  }, []);

  return (
    <section id="welcome">
      <p ref={subTitleRef}>
        {renderText({
          text: "Hey, I'm Harsh! Welcome to my",
          className: "text-3xl font-georama",
          baseWeight: 100,
        })}
      </p>
      <h1 ref={titleRef} className="mt-7">
        {renderText({
          text: "portfolio",
          className: "text-9xl italic font-georama",
          baseWeight: 400,
        })}
      </h1>

      <div className="small-screen">
        <p>This Portfolio is designed for desktop and tablet screens only.</p>
      </div>
    </section>
  );
};

export default Welcome;
