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
}) => {
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const gradientId = `gradient-${id}`;

  // 🔥 Get live node colors from the store
  const sourceColor = useStore(
    (s) => s.nodeInternals.get(source)?.data?.darkColor || '#000'
  );
  const targetColor = useStore(
    (s) => s.nodeInternals.get(target)?.data?.darkColor || '#000'
  );

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

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

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
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
    </g>
  );
};

export default AnimatedGradientEdge;
