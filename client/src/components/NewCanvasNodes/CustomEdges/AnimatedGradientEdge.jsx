import React, { useEffect, useRef } from 'react';
import { getBezierPath, useStore } from 'reactflow';

const AnimatedGradientEdge = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data
}) => {
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const gradientId = `gradient-${id}`;
  const labelRef = useRef(null);

  // 🔥 Get live node colors from the store
  const sourceColor = useStore(
    (s) => s.nodeInternals.get(source)?.data?.darkColor || '#000'
  );
  const targetColor = useStore(
    (s) => s.nodeInternals.get(target)?.data?.darkColor || '#000'
  );

  const [edgePath,labelX,labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  useEffect(() => {
    
    const animate = () => {
      if (!circleRef.current) return;

      const path = markerRef.current;
      const length = path.getTotalLength();
      let progress = 0;

      const animateStep = () => {
        progress += 2;
        if (progress > length) progress = 0;

        const point = path.getPointAtLength(progress);
        circleRef.current.setAttribute('cx', point.x);
        circleRef.current.setAttribute('cy', point.y);

        requestAnimationFrame(animateStep);
      };

      animateStep();
    };

    animate();
  }, []);

  useEffect(() => {
    if (!circleRef.current || !markerRef.current) return;

    const path = markerRef.current;
    const length = path.getTotalLength();
    let progress = 0;
    let frameId;

    const animateStep = () => {
      progress += 0.5;
      if (progress > length) progress = 0;

      const point = path.getPointAtLength(progress);
      circleRef.current.setAttribute('cx', point.x);
      circleRef.current.setAttribute('cy', point.y);

      frameId = requestAnimationFrame(animateStep);
    };

    frameId = requestAnimationFrame(animateStep);
    return () => cancelAnimationFrame(frameId);
  }, [sourceX, sourceY, targetX, targetY, sourceColor, targetColor]);

  // Calculate midpoint for label positioning
  const midPointX = (sourceX + targetX) / 2;
  const midPointY = (sourceY + targetY) / 2;

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={sourceX} y1={sourceY} x2={targetX} y2={targetY}>
          <stop offset="0%" stopColor={sourceColor} />
          <stop offset="100%" stopColor={targetColor} />
        </linearGradient>
      </defs>

      <path
        id={`path-${id}`}
        ref={markerRef}
        d={edgePath}
        stroke={`url(#${gradientId})`}
        strokeWidth={2}
        fill="none"
      />
      <circle ref={circleRef} r={5} fill={sourceColor} />
      {data?.label && (
        <text
          ref={labelRef}
          x={midPointX}
          y={midPointY}
          textAnchor="middle"
          dy="-10px" // Adjust to avoid overlap with the path
          fontSize="10px"
          fontFamily="Arial, sans-serif"
          fill={data?.sourceColor || '#000'}
          fontWeight="bold"
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }} // For better visibility
        >
          {data.label}
        </text>
      )}
    </g>
  );
};

export default AnimatedGradientEdge;
