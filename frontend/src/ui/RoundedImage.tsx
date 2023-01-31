import React from "react";

import cn from "classnames";
import { default as NextImage } from "next/image";

// Avatar
const RoundedImage = ({
  src,
  alt,
  size = "60px",
  className = "",
}: {
  src: string;
  alt: string;
  size?: string;
  className?: string;
}) => {
  const sz = `h-[${size}] w-[${size}]`;
  return (
    <div className={cn(`relative ${sz}`, className)}>
      <figure
        className={cn(
          `absolute flex ${sz} items-center justify-center rounded-full`
        )}
      >
        <NextImage
          src={src}
          alt={alt}
          fill
          className={cn(`rounded-full object-cover`, sz)}
        />
      </figure>
    </div>
  );
};
export default RoundedImage;
