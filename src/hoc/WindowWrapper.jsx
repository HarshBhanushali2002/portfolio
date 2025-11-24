import useWindowStore from "@/store/window";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import React, { useLayoutEffect, useRef, useEffect, useState } from "react";

const WindowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const { windows, focusWindow } = useWindowStore();
    const { isOpen, zIndex, isMinimized, isMaximized } = windows[windowKey];

    const ref = useRef(null);

    const useWindowStoreRef = useRef(useWindowStore);
    const [isVisible, setIsVisible] = useState(isOpen && !isMinimized);
    const [isClosing, setIsClosing] = useState(false);
    const prevIsOpen = useRef(isOpen);
    const prevIsMinimized = useRef(isMinimized);

    // Mapping from windowKey to dock app name
    const windowKeyToDockName = {
      finder: "Portfolio",
      safari: "Articles",
      photos: "Gallery",
      contact: "Contact",
      terminal: "Skills",
      trash: "Archive",
      resume: "Resume",
      txtfile: "Portfolio", // fallback or adjust as needed
      imgfile: "Portfolio", // fallback or adjust as needed
    };

    // Helper to get dock icon center position
    const getDockIconCenter = () => {
      const dockName = windowKeyToDockName[windowKey] || windowKey;
      const dockIcon = document.querySelector(
        `.dock-icon[aria-label="${dockName}"]`
      );
      if (!dockIcon) return null;
      const iconRect = dockIcon.getBoundingClientRect();
      return {
        x: iconRect.left + iconRect.width / 2,
        y: iconRect.top + iconRect.height / 2,
      };
    };

    // Helper to get window center position
    const getWindowCenter = () => {
      const element = ref.current;
      if (!element) return null;
      const winRect = element.getBoundingClientRect();
      return {
        x: winRect.left + winRect.width / 2,
        y: winRect.top + winRect.height / 2,
      };
    };

    // Patch closeWindow to set isClosing flag
    const closeWindowWithAnim = () => {
      setIsClosing(true);
      // Don't call store.closeWindow yet; let animation finish
    };

    // Patch minimizeWindow to clear isClosing flag
    const minimizeWindowWithAnim = () => {
      setIsClosing(false);
      useWindowStore.getState().minimizeWindow(windowKey);
    };

    // Animate in (open)
    useEffect(() => {
      if (
        isOpen &&
        !isMinimized &&
        (!prevIsOpen.current || prevIsMinimized.current)
      ) {
        setIsVisible(true);
        const element = ref.current;
        if (element) {
          // Wait for the window to be rendered and positioned
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const dockCenter = getDockIconCenter();
              const winCenter = getWindowCenter();
              let dx = 0,
                dy = 200;
              if (dockCenter && winCenter) {
                dx = dockCenter.x - winCenter.x;
                dy = dockCenter.y - winCenter.y;
              }
              gsap.fromTo(
                element,
                { scaleX: 0.05, scaleY: 0.7, x: dx, y: dy },
                {
                  scaleX: 1.08,
                  scaleY: 1.04,
                  x: 0,
                  y: 0,
                  duration: 0.32,
                  ease: "expo.out",
                  onComplete: () => {
                    gsap.to(element, {
                      scaleX: 1,
                      scaleY: 1,
                      duration: 0.12,
                      ease: "expo.out",
                    });
                  },
                }
              );
            });
          });
        }
      }
      prevIsOpen.current = isOpen;
      prevIsMinimized.current = isMinimized;
    }, [isOpen, isMinimized]);

    // Animate out (close or minimize)
    useEffect(() => {
      if (((!isOpen && isClosing) || isMinimized) && isVisible) {
        const element = ref.current;
        if (element) {
          const dockCenter = getDockIconCenter();
          const winCenter = getWindowCenter();
          let dx = 0,
            dy = 200;
          if (dockCenter && winCenter) {
            dx = dockCenter.x - winCenter.x;
            dy = dockCenter.y - winCenter.y;
          }
          gsap.to(element, {
            scaleX: 0.2,
            scaleY: 0.7,
            x: dx,
            y: dy,
            duration: 0.4,
            ease: "expo.in",
            onComplete: () => {
              setIsVisible(false);
              if (isMinimized) {
                useWindowStoreRef.current
                  .getState()
                  .finalizeMinimize(windowKey);
              }
              if (isClosing) {
                useWindowStore.getState().closeWindow(windowKey);
                setIsClosing(false);
              }
            },
          });
        } else {
          setIsVisible(false);
        }
      }
    }, [isOpen, isMinimized, isVisible, isClosing]);

    // useGSAP(() => {
    //   const element = ref.current;
    //   if (!element || !isOpen) return;
    //   element.style.display = "block";

    //   gsap.fromTo(
    //     element,
    //     { opacity: 0, scale: 0.95, y: 40 },
    //     { opacity: 1, scale: 1, y: 0, duration: 5, ease: "power3.out" }
    //   );
    // }, [isOpen]);

    useGSAP(() => {
      const element = ref.current;
    //   console.log("element", element);
      if (!element) return;
      const [instance] = Draggable.create(element, {
        // type: "x,y",
        onPress: () => focusWindow(windowKey),
      });

      return () => {
        if (instance) instance.kill();
      };
    }, []);

    // useGSAP(() => {
    //   const element = ref.current;
    //   if (!element) return;
    //   let instance = null;
    //   // Make only the header (not the whole window) the drag handle
    //   const header = element.querySelector("#window-header");
    //   if (!isMaximized && header) {
    //     gsap.set(element, { clearProps: "x,y" });
    //     [instance] = Draggable.create(element, {
    //       type: "x,y",
    //       trigger: header, // Only drag from header
    //       onPress: () => focusWindow(windowKey),
    //       edgeResistance: 0.18,
    //       inertia: true,
    //     });
    //   }
    //   return () => {
    //     if (instance) instance.kill();
    //   };
    // }, [isMaximized, isOpen]);

    useLayoutEffect(() => {
      const element = ref.current;
      if (!element) return;
      element.style.display = isOpen ? "block" : "none";
    }, [isOpen]);

    // Instead of returning null, keep the window in the DOM but hidden (for animation/Draggable cleanup)
    return (
      <section
        id={windowKey}
        ref={ref}
        style={{
          zIndex,
          display: isVisible ? undefined : "none",
        }}
        className={`absolute${isMaximized ? " maximized" : ""}`}
      >
        <Component
          {...props}
          onClose={closeWindowWithAnim}
          onMinimize={minimizeWindowWithAnim}
        />
      </section>
    );
  };

  Wrapped.displayName = `WindowWrapper(${
    Component.displayName || Component.name || "Component"
  })`;
  return Wrapped;
};

export default WindowWrapper;
