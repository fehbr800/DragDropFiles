import { primary45 } from "@/utils/colors";
import useHover from '@/hooks/useHover'
import React from "react";


export function BigButton({
  title,
  onClick,
  inverted,
  fullWidth,
  customFillColor,
  customWhiteColor,
  style,
  noHover,
  id,
  small,
  disabled,
  marginRight,
  className,

}) {
  const [hoverRef, isHovered] = useHover();

  let fillColor = customFillColor || "bg-indigo-500";
  const whiteColor = customWhiteColor || "text-white";

  let initialBg = null;
  let hoverBg = fillColor;

  let initialColor = fillColor;
  let hoverColor = whiteColor;

  if (inverted) {
    initialBg = fillColor;
    hoverBg = null;
    initialColor = whiteColor;
    hoverColor = fillColor;
  }

  if (disabled) {
    initialBg = "bg-indigo-600";
    hoverBg = "bg-indigo-400";
    fillColor = "bg-indigo-300";
  }

  return (
    <button
      id={id}
      ref={hoverRef}
      className={`inline-flex items-center justify-center: ${className}}  `}
      style={style}
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
    >
      {title}
    </button>
  );
}