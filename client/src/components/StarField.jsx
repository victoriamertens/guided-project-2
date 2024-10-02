// https://codepen.io/Vicente-Alcazar/pen/NWZbmqP

import { useRef, useEffect } from "react";

export default function StarField() {
  const canvasRef = useRef(null);
  const numStars = 500;
  const stars = Array.from({ length: numStars }, () => ({
    x: Math.random() * window.innerWidth - window.innerWidth / 2,
    y: Math.random() * window.innerHeight - window.innerHeight / 2,
    z: Math.random() * window.innerWidth,
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";

      stars.forEach((star) => {
        const x = centerX + (star.x / star.z) * canvas.width;
        const y = centerY + (star.y / star.z) * canvas.height;
        const size = 1.5 * (1 - star.z / canvas.width);

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2, false);
        ctx.fill();

        star.z -= 2;

        if (star.z <= 0) {
          star.z = canvas.width;
          star.x = Math.random() * canvas.width - centerX;
          star.y = Math.random() * canvas.height - centerY;
        }
      });

      requestAnimationFrame(draw);
    };

    window.addEventListener("resize", handleResize);
    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [stars]);

  return <canvas ref={canvasRef} />;
}
