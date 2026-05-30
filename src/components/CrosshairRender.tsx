/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CrosshairConfig } from '../types';

interface CrosshairRenderProps {
  config: CrosshairConfig;
  animationState?: 'idle' | 'firing' | 'aiming';
  scale?: number; // scaling factor for high-resolution previewing
}

export const CrosshairRender: React.FC<CrosshairRenderProps> = ({
  config,
  animationState = 'idle',
  scale = 1
}) => {
  const {
    shape,
    size,
    color,
    opacity,
    thickness,
    gap,
    hasDot,
    dotSize,
    dotColor,
    outlineColor,
    outlineThickness,
    hasOutline,
    rotation
  } = config;

  // Compute dynamic expansion for firing animation
  let animGapOffset = 0;
  let animScale = 1;
  
  if (animationState === 'firing') {
    animGapOffset = 12; // expand crosshair gap during firing
    animScale = 1.15; // slightly scale up
  } else if (animationState === 'aiming') {
    animGapOffset = -2; // tighten crosshair for precise aiming
    animScale = 0.95;
  }

  const finalGap = Math.max(0, gap + animGapOffset) * scale;
  const finalSize = size * scale * animScale;
  const radius = finalSize / 2;
  const svgSize = finalSize + (thickness + (hasOutline ? outlineThickness * 2 : 0)) * 2 * scale;
  const center = svgSize / 2;

  const strokeWidth = thickness * scale;
  const outlineStrokeWidth = (thickness + outlineThickness * 2) * scale;

  // Helpers to draw the same shapes twice (once for outline, once for main color)
  const renderShapeElements = (isOutline: boolean) => {
    const strokeColor = isOutline ? outlineColor : color;
    const currentStrokeWidth = isOutline ? outlineStrokeWidth : strokeWidth;
    const strokeLinecap = 'round';

    switch (shape) {
      case 'dot':
        // If not using the separate dot, draw a central bullet
        if (!hasDot) {
          return (
            <circle
              cx={center}
              cy={center}
              r={radius / 3}
              fill={strokeColor}
              opacity={isOutline ? 1 : opacity}
            />
          );
        }
        return null;

      case 'circle':
        return (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={currentStrokeWidth}
            opacity={isOutline ? 1 : opacity}
          />
        );

      case 'cross':
        return (
          <g stroke={strokeColor} strokeWidth={currentStrokeWidth} strokeLinecap={strokeLinecap} opacity={isOutline ? 1 : opacity}>
            {/* Left */}
            <line x1={center - radius} y1={center} x2={center - finalGap} y2={center} />
            {/* Right */}
            <line x1={center + finalGap} y1={center} x2={center + radius} y2={center} />
            {/* Top */}
            <line x1={center} y1={center - radius} x2={center} y2={center - finalGap} />
            {/* Bottom */}
            <line x1={center} y1={center + finalGap} x2={center} y2={center + radius} />
          </g>
        );

      case 't-shape':
        return (
          <g stroke={strokeColor} strokeWidth={currentStrokeWidth} strokeLinecap={strokeLinecap} opacity={isOutline ? 1 : opacity}>
            {/* Left */}
            <line x1={center - radius} y1={center} x2={center - finalGap} y2={center} />
            {/* Right */}
            <line x1={center + finalGap} y1={center} x2={center + radius} y2={center} />
            {/* Bottom */}
            <line x1={center} y1={center + finalGap} x2={center} y2={center + radius} />
          </g>
        );

      case 'chevron': {
        const height = radius;
        const width = radius;
        const points = `${center - width},${center + height} ${center},${center - height / 2} ${center + width},${center + height}`;
        return (
          <polyline
            points={points}
            fill="none"
            stroke={strokeColor}
            strokeWidth={currentStrokeWidth}
            strokeLinecap={strokeLinecap}
            strokeLinejoin="round"
            opacity={isOutline ? 1 : opacity}
          />
        );
      }

      case 'diamond': {
        const points = `${center},${center - radius} ${center + radius},${center} ${center},${center + radius} ${center - radius},${center}`;
        return (
          <polygon
            points={points}
            fill="none"
            stroke={strokeColor}
            strokeWidth={currentStrokeWidth}
            strokeLinejoin="round"
            opacity={isOutline ? 1 : opacity}
          />
        );
      }

      case 'target':
        return (
          <g opacity={isOutline ? 1 : opacity}>
            <circle
              cx={center}
              cy={center}
              r={radius / 1.5}
              fill="none"
              stroke={strokeColor}
              strokeWidth={currentStrokeWidth}
            />
            <g stroke={strokeColor} strokeWidth={currentStrokeWidth} strokeLinecap={strokeLinecap}>
              {/* Left */}
              <line x1={center - radius} y1={center} x2={center - finalGap} y2={center} />
              {/* Right */}
              <line x1={center + finalGap} y1={center} x2={center + radius} y2={center} />
              {/* Top */}
              <line x1={center} y1={center - radius} x2={center} y2={center - finalGap} />
              {/* Bottom */}
              <line x1={center} y1={center + finalGap} x2={center} y2={center + radius} />
            </g>
          </g>
        );

      case 'star': {
        // Simple sharp four-pointed star path
        const d = `M ${center} ${center - radius} 
                   Q ${center} ${center} ${center + radius} ${center} 
                   Q ${center} ${center} ${center} ${center + radius} 
                   Q ${center} ${center} ${center - radius} ${center} 
                   Q ${center} ${center} ${center} ${center - radius} Z`;
        return (
          <path
            d={d}
            fill={shape === 'star' && !isOutline ? strokeColor : 'none'}
            stroke={strokeColor}
            strokeWidth={currentStrokeWidth}
            strokeLinejoin="round"
            opacity={isOutline ? 1 : opacity}
          />
        );
      }

      case 'smiley':
        return (
          <g stroke={strokeColor} strokeWidth={currentStrokeWidth} fill="none" opacity={isOutline ? 1 : opacity}>
            {/* Outer Circle */}
            <circle cx={center} cy={center} r={radius} />
            {/* Left Eye */}
            <circle cx={center - radius / 3} cy={center - radius / 4} r={currentStrokeWidth / 1.5} fill={strokeColor} />
            {/* Right Eye */}
            <circle cx={center + radius / 3} cy={center - radius / 4} r={currentStrokeWidth / 1.5} fill={strokeColor} />
            {/* Smiling Mouth */}
            <path
              d={`M ${center - radius / 2} ${center + radius / 8} Q ${center} ${center + radius / 1.5} ${center + radius / 2} ${center + radius / 8}`}
              strokeLinecap="round"
            />
          </g>
        );

      case 'rotating':
        return (
          <g opacity={isOutline ? 1 : opacity} className="animate-[spin_3s_linear_infinite]" style={{ transformOrigin: `${center}px ${center}px` }}>
            {/* 3 Symmetrical turbine/shuriken blades */}
            {Array.from({ length: 3 }).map((_, i) => (
              <path
                key={i}
                d={`M ${center} ${center - finalGap} Q ${center + radius * 0.5} ${center - radius * 0.5} ${center + radius * 0.85} ${center - radius * 0.15}`}
                fill="none"
                stroke={isOutline ? strokeColor : undefined}
                strokeWidth={currentStrokeWidth}
                strokeLinecap="round"
                transform={`rotate(${i * 120}, ${center}, ${center})`}
                className={isOutline ? "" : "rainbow-stroke"}
              />
            ))}
            {/* Segmented Ring */}
            <circle
              cx={center}
              cy={center}
              r={Math.max(4, radius * 0.45)}
              fill="none"
              stroke={isOutline ? strokeColor : undefined}
              strokeWidth={currentStrokeWidth}
              strokeDasharray="4 2"
              className={isOutline ? "" : "rainbow-stroke"}
            />
            {/* Outer dotted tracking circle */}
            <circle
              cx={center}
              cy={center}
              r={Math.max(6, radius * 0.95)}
              fill="none"
              stroke={isOutline ? strokeColor : undefined}
              strokeWidth={currentStrokeWidth * 0.7}
              strokeDasharray="2 3"
              className={isOutline ? "" : "rainbow-stroke"}
            />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="relative flex items-center justify-center select-none"
      style={{
        width: `${svgSize}px`,
        height: `${svgSize}px`,
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="absolute top-0 left-0 overflow-visible"
      >
        <style>{`
          @keyframes rainbowStroke {
            0% { stroke: #ff0055; }
            17% { stroke: #ff9900; }
            33% { stroke: #33ff00; }
            50% { stroke: #00ffff; }
            67% { stroke: #0055ff; }
            83% { stroke: #cc00ff; }
            100% { stroke: #ff0055; }
          }
          @keyframes rainbowFill {
            0% { fill: #ff0055; }
            17% { fill: #ff9900; }
            33% { fill: #33ff00; }
            50% { fill: #00ffff; }
            67% { fill: #0055ff; }
            83% { fill: #cc00ff; }
            100% { fill: #ff0055; }
          }
          .rainbow-stroke {
            animation: rainbowStroke 2.5s linear infinite !important;
          }
          .rainbow-fill {
            animation: rainbowFill 2.5s linear infinite !important;
          }
        `}</style>
        {/* 1. Outlines rendered underneath */}
        {hasOutline && renderShapeElements(true)}

        {/* 2. Main color elements */}
        {renderShapeElements(false)}

        {/* 3. Central Dot (Rendered on top and doesn't rotate with rotation unless explicitly wanted) */}
        {hasDot && (
          <>
            {/* Dot Outline */}
            {hasOutline && (
              <circle
                cx={center}
                cy={center}
                r={(dotSize * scale) / 2 + outlineThickness * scale}
                fill={outlineColor}
                opacity={opacity}
              />
            )}
            {/* Dot Color */}
            <circle
              cx={center}
              cy={center}
              r={(dotSize * scale) / 2}
              fill={shape === 'rotating' ? undefined : dotColor}
              className={shape === 'rotating' ? 'rainbow-fill' : ''}
              opacity={opacity}
            />
          </>
        )}
      </svg>
    </div>
  );
};
