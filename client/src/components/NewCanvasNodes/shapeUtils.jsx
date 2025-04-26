import React from 'react';

export function renderShape(shapeType, { width, height, fill, borderColor, darkColor }) {
  switch (shapeType) {
    case 'diamond':
        {
        const diamondWidth = width * Math.SQRT2;
        const diamondHeight = height * Math.SQRT2;
        const offsetX = (diamondWidth - width) / 2;
        const offsetY = (diamondHeight - height) / 2;
        return (
            <svg
              width={diamondWidth}
              height={diamondHeight}
              viewBox={`0 0 ${diamondWidth} ${diamondHeight}`}
              style={{
                position: 'absolute',
                top: -offsetY,
                left: -offsetX,
                zIndex: -1,
                overflow: 'visible',
                pointerEvents: 'none',
              }}
            >
              <polygon
                points={`
                  ${diamondWidth / 2},0 
                  ${diamondWidth},${diamondHeight / 2} 
                  ${diamondWidth / 2},${diamondHeight} 
                  0,${diamondHeight / 2}
                `}
                fill={fill}
                stroke={borderColor}
                strokeWidth="1"
              />
            </svg>
          );
        }

        case 'parallelogram': {
            const slant = 20; // amount of slant
            const extra = 20; // expand SVG beyond node box
          
            return (
              <svg
                width={width + extra * 2}
                height={height + extra * 2}
                style={{
                  position: 'absolute',
                  top: -extra,
                  left: -extra,
                  zIndex: -1,
                  pointerEvents: 'none',
                }}
              >
                <polygon
                  points={`
                    ${slant + extra},${extra}
                    ${width + extra},${extra}
                    ${width - slant + extra},${height + extra}
                    ${extra},${height + extra}
                  `}
                  fill={fill}
                  stroke={borderColor}
                  strokeWidth="1"
                />
              </svg>
            );
          }

          case 'cylinder-vertical': {
            // Additional padding for visual separation
            const extra = 80; 
          
            // Defining ellipse and body dimensions
            const ellipseHeight = 50; // Height of the top/bottom ellipses
            const rectHeight = height - ellipseHeight; // Height of the rectangle body
          
            return (
              <svg
                width={width + extra * 2} // Adjust width for padding
                height={height + extra * 2} // Adjust height for padding
                style={{
                  position: 'absolute',
                  top: -extra, 
                  left: -extra,
                  zIndex: -1,
                  pointerEvents: 'none', // Avoid interaction with the SVG
                  transform: 'scaleY(-1)'
                }}
              >
                {/* Gradient for cylinder body */}
                <defs>
                  <linearGradient id="cyl-v-body" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={fill} stopOpacity="1" />
                    <stop offset="100%" stopColor={fill} stopOpacity="0.9" />
                  </linearGradient>
                </defs>
          
                {/* Upper Ellipse (Top surface) */}
                <ellipse
                  cx={(width + extra * 2) / 2}
                  cy={extra + ellipseHeight / 2}
                  rx={width / 2}
                  ry={ellipseHeight / 2}
                  fill={fill}
                  stroke="black" // Black border for the top ellipse
                  strokeWidth="1"
                />
          
                {/* Cylinder Body (Rectangle part of the cylinder) */}
                <rect
                  x={extra}
                  y={extra + ellipseHeight / 2}
                  width={width}
                  height={rectHeight}
                  fill="url(#cyl-v-body)"
                  stroke={borderColor}
                  strokeWidth="1"
                />
          
                {/* Bottom Ellipse (Visible edge only) */}
                <ellipse
                  cx={(width + extra * 2) / 2}
                  cy={extra + height - ellipseHeight / 2}
                  rx={width / 2}
                  ry={ellipseHeight / 2}
                  fill={fill}
                  stroke="black" // Black border for the bottom ellipse
                  strokeWidth="1"
                />
              </svg>
            );
          }
          

          case 'cylinder-horizontal': {
            const extra = 20;
          
            const ellipseWidth = 20; // Width of the left/right ellipses
            const rectWidth = width - ellipseWidth * 2; // Width of the rectangle body
          
            // Get the color from darkColor dynamically
            const cylinderColor = darkColor || fill; // Use the node color, fallback to fill if undefined
          
            return (
              <svg
                width={width + extra * 2} // Adjust width for padding
                height={height + extra * 2} // Adjust height for padding
                style={{
                  position: 'absolute',
                  top: -extra,
                  left: -extra,
                  zIndex: -1,
                  pointerEvents: 'none', // Avoid interaction with the SVG
                }}
              >
                {/* Gradient for cylinder body */}
                <defs>
                  <linearGradient id="cyl-h-body" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={cylinderColor} stopOpacity="1" />
                    <stop offset="100%" stopColor={cylinderColor} stopOpacity="0.9" />
                  </linearGradient>
                </defs>
          
                {/* Left Ellipse (Hidden circular edge) */}
                <ellipse
                  cx={extra + ellipseWidth} // Position the left ellipse to the left side
                  cy={height / 2 + extra}
                  rx={ellipseWidth}
                  ry={height / 2}
                  fill={cylinderColor} // Use dynamic color here
                  stroke="black" // Black border for the hidden left ellipse
                  strokeWidth="1"
                />
          
                {/* Cylinder Body (Rectangle part of the cylinder) */}
                <rect
                  x={extra + ellipseWidth}
                  y={extra}
                  width={rectWidth}
                  height={height}
                  fill="url(#cyl-h-body)"
                  stroke={borderColor}
                  strokeWidth="1"
                />
          
                {/* Right Ellipse (Front circular face) */}
                <ellipse
                  cx={extra + width - ellipseWidth} // Position the right ellipse to the right side
                  cy={height / 2 + extra}
                  rx={ellipseWidth}
                  ry={height / 2}
                  fill={cylinderColor} // Use dynamic color here
                  stroke="black" // Black border for the right ellipse
                  strokeWidth="1"
                />
              </svg>
            );
          }
          
          

          case 'ellipse':
            return (
              <svg
                width={width + 10}
                height={height + 10}
                style={{
                  position: 'absolute',
                  top: -5,
                  left: -5,
                  zIndex: -1,
                }}
              >
                <ellipse
                  cx={(width + 10) / 2}
                  cy={(height + 10) / 2}
                  rx={(width + 10) / 2}
                  ry={(height + 10) / 2}
                  fill={fill}
                  stroke={borderColor}
                  strokeWidth="1"
                />
              </svg>
            );
            case 'hexagon':
  return (
    <svg
      width={width + 10}
      height={height + 10}
      style={{
        position: 'absolute',
        top: -5,
        left: -5,
        zIndex: -1,
      }}
    >
      <polygon
        points={`
          ${width * 0.25},0 
          ${width * 0.75},0 
          ${width},${height / 2} 
          ${width * 0.75},${height} 
          ${width * 0.25},${height} 
          0,${height / 2}
        `}
        fill={fill}
        stroke={borderColor}
        strokeWidth="1"
      />
    </svg>
  );
  case 'cloud':
  return (
    <svg
      width={width + 100}
      height={height + 120}
      style={{
        position: 'absolute',
        top: -60,
        left: -50,
        zIndex: -1,
      }}
      viewBox={`0 0 ${width + 100} ${height + 120}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d={`
          M${(width + 100) * 0.25},${(height + 120) * 0.7}
          C${(width + 100) * 0.1},${(height + 120) * 0.7}
           ${(width + 100) * 0.05},${(height + 120) * 0.5}
           ${(width + 100) * 0.15},${(height + 120) * 0.4}
          C${(width + 100) * 0.15},${(height + 120) * 0.25}
           ${(width + 100) * 0.35},${(height + 120) * 0.15}
           ${(width + 100) * 0.45},${(height + 120) * 0.3}
          C${(width + 100) * 0.55},${(height + 120) * 0.05}
           ${(width + 100) * 0.85},${(height + 120) * 0.15}
           ${(width + 100) * 0.75},${(height + 120) * 0.4}
          C${(width + 100) * 0.95},${(height + 120) * 0.45}
           ${(width + 100) * 0.9},${(height + 120) * 0.7}
           ${(width + 100) * 0.75},${(height + 120) * 0.7}
          Z
        `}
        fill={fill}
        stroke={borderColor}
        strokeWidth="1"
      />
    </svg>
  );
  case 'terminal-icon':
    return (
        <svg
          width={width}
          height={height}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        >
          <rect
            width={width}
            height={height}
            rx= {height/2} // Set rounded corners with 12px radius
            ry={height/2} // Set rounded corners with 12px radius
            fill={`rgba(${parseInt(fill.slice(1, 3), 16)}, ${parseInt(fill.slice(3, 5), 16)}, ${parseInt(fill.slice(5, 7), 16)}, 0.95)`} // 70% opacity
            stroke={borderColor}
            strokeWidth="1"
          />
        </svg>
      );


            case 'arrowhead-right':
                return (
                  <svg
                    width={width + 10}
                    height={height + 10}
                    style={{
                      position: 'absolute',
                      top: -5,
                      left: -5,
                      zIndex: -1,
                    }}
                  >
                    <polygon
                      points={`
                        0,${height / 4} 
                        ${(width * 2) / 3},${height / 4} 
                        ${(width * 2) / 3},0 
                        ${width},${height / 2} 
                        ${(width * 2) / 3},${height} 
                        ${(width * 2) / 3},${(3 * height) / 4} 
                        0,${(3 * height) / 4}
                      `}
                      fill={fill}
                      stroke={borderColor}
                      strokeWidth="1"
                    />
                  </svg>
                );
              

      case 'rectangle':
        default:
        return (
          <svg
            width={width}
            height={height}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: -1,
            }}
          >
            <rect
              width={width}
              height={height}
              rx="8" // Set rounded corners with 12px radius
              ry="8" // Set rounded corners with 12px radius
              fill={`rgba(${parseInt(fill.slice(1, 3), 16)}, ${parseInt(fill.slice(3, 5), 16)}, ${parseInt(fill.slice(5, 7), 16)}, 0.95)`} // 70% opacity
              stroke={borderColor}
              strokeWidth="1"
            />
          </svg>
        );
  }
}
