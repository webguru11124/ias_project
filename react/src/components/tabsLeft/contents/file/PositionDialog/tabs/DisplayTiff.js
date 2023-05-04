import React, { useRef, useEffect } from 'react';
import { decode } from 'tiff';

const DisplayTiff = ({ tiffUrl }) => {
  //console.log(tiffUrl);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.onload = function () {
      ctx.drawImage(image, 0, 0);
    };
    image.src = URL.createObjectURL(
      new Blob([decode(tiffUrl).reverse()], { type: 'image/tiff' }),
    );

    return () => URL.revokeObjectURL(image.src);
  }, [tiffUrl]);

  return <canvas ref={canvasRef} width={500} height={500} />;
};

export default DisplayTiff;
