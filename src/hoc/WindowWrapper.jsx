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
    };

    // Helper to get dock icon center position
    const getDockIconCenter = () => {
      // Use the dock icon for the current windowKey
      // If the dock icon is not visible (e.g., for txtfile/imgfile), fallback to the first visible dock icon
      const dockName = windowKeyToDockName[windowKey] || windowKey;
      let dockIcon = document.querySelector(
        `.dock-icon[aria-label="${dockName}"]`
      );
      if (!dockIcon || dockIcon.offsetParent === null) {
        // Fallback: find the first visible dock icon
        const allIcons = document.querySelectorAll(".dock-icon[aria-label]");
        for (const icon of allIcons) {
          if (icon.offsetParent !== null) {
            dockIcon = icon;
            break;
          }
        }
      }
      if (!dockIcon) return null;
      const iconRect = dockIcon.getBoundingClientRect();
      return {
        x: iconRect.left + iconRect.width / 2,
        y: iconRect.top + iconRect.height / 2,
      };
    };

    // Helper to get the position from where the window should animate
    const getAnimationStartPosition = () => {
      const dockName = windowKeyToDockName[windowKey] || windowKey;

      // First, try to find the navbar item (for windows opened from navbar)
      const navItem = document.querySelector(`li[data-window="${windowKey}"]`);
      if (navItem && navItem.offsetParent !== null) {
        const rect = navItem.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }

      // Fall back to dock icon
      let dockIcon = document.querySelector(
        `.dock-icon[aria-label="${dockName}"]`
      );
      if (!dockIcon || dockIcon.offsetParent === null) {
        // Fallback: find the first visible dock icon
        const allIcons = document.querySelectorAll(".dock-icon[aria-label]");
        for (const icon of allIcons) {
          if (icon.offsetParent !== null) {
            dockIcon = icon;
            break;
          }
        }
      }
      if (!dockIcon) return null;
      const iconRect = dockIcon.getBoundingClientRect();
      return {
        x: iconRect.left + iconRect.width / 2,
        y: iconRect.top + iconRect.height / 2,
      };
    };

    // Helper to get window center position
    const getWindowCenter = (forMinimize = false) => {
      const element = ref.current;
      if (!element) return null;
      // For Safari, only use center of viewport for open animation, not for minimize/close
      if (windowKey === "safari" && !forMinimize) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        return {
          x: vw / 2,
          y: vh / 2,
        };
      }
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
          // --- Fix: Hide window before animation to prevent layout jump ---
          element.style.visibility = "hidden";

          // CRITICAL FIX: Clear any existing transforms before animation
          gsap.set(element, { clearProps: "all" });
          element.style.visibility = "hidden"; // Reapply after clearProps

          // Wait for next paint so the window is laid out in its final position
          requestAnimationFrame(() => {
            // Now show the window, but keep it at the dock position and scale
            const dockCenter = getAnimationStartPosition();
            const winCenter = getWindowCenter();
            let dx = 0,
              dy = 200;
            if (dockCenter && winCenter) {
              dx = dockCenter.x - winCenter.x;
              dy = dockCenter.y - winCenter.y;
            }
            // Set initial transform instantly, still hidden
            gsap.set(element, {
              scaleX: 0.05,
              scaleY: 0.7,
              x: dx,
              y: dy,
              transformOrigin: "50% 50%",
            });
            // Now make visible and animate in
            element.style.visibility = "visible";
            gsap.to(element, {
              scaleX: 1.08,
              scaleY: 1.04,
              x: 0,
              y: 0,
              duration: 0.32,
              ease: "expo.out",
              onUpdate: () => {
                element.style.willChange = "transform";
              },
              onComplete: () => {
                gsap.to(element, {
                  scaleX: 1,
                  scaleY: 1,
                  duration: 0.12,
                  ease: "expo.out",
                  onComplete: () => {
                    element.style.willChange = "";
                  },
                });
              },
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
          // Get dock icon center and window rect
          const dockCenter = getAnimationStartPosition();
          const winRect = element.getBoundingClientRect();
          // Calculate the current transform (if any) applied by Draggable
          const computedStyle = window.getComputedStyle(element);
          const matrix =
            computedStyle.transform !== "none" ? computedStyle.transform : null;
          let currentX = 0,
            currentY = 0;
          if (matrix) {
            const values = matrix.match(/matrix.*\((.+)\)/)[1].split(", ");
            currentX = parseFloat(values[4]);
            currentY = parseFloat(values[5]);
          }
          // Animate to dock icon: squeeze bottom of window into dock icon
          let dx = 0,
            dy = 0;
          if (dockCenter && winRect) {
            dx = dockCenter.x - (winRect.left + winRect.width / 2) + currentX;
            dy = dockCenter.y - (winRect.top + winRect.height) + currentY;
          }
          gsap.to(element, {
            transformOrigin: "50% 100%", // bottom center
            scaleX: 0.03, // more squeeze horizontally
            scaleY: 0.01, // more squeeze vertically
            x: dx,
            y: dy,
            duration: 0.55,
            ease: "expo.inOut",
            onUpdate: () => {
              element.style.willChange = "transform";
            },
            onComplete: () => {
              element.style.willChange = "";
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

    useGSAP(() => {
      const element = ref.current;
      if (!element) return;
      const [instance] = Draggable.create(element, {
        onPress: () => {
          // Always bring to front on click/drag
          focusWindow(windowKey);
        },
      });

      // Also bring to front on click (not just drag)
      const handleClick = (e) => {
        // Only focus if not right-click
        if (e.button === 0) focusWindow(windowKey);
      };
      element.addEventListener("mousedown", handleClick);

      return () => {
        if (instance) instance.kill();
        element.removeEventListener("mousedown", handleClick);
      };
    }, []);

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
