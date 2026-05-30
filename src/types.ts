/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CrosshairShape = 'dot' | 'circle' | 'cross' | 't-shape' | 'chevron' | 'diamond' | 'smiley' | 'target' | 'star' | 'rotating';

export interface CrosshairConfig {
  id?: string;
  name: string;
  shape: CrosshairShape;
  size: number; // in pixels
  color: string; // hex or rgb
  opacity: number; // 0 to 1
  thickness: number; // line thickness
  gap: number; // center gap
  hasDot: boolean;
  dotSize: number;
  dotColor: string;
  outlineColor: string;
  outlineThickness: number;
  hasOutline: boolean;
  rotation: number; // degrees
  offsetX: number; // px
  offsetY: number; // px
}

export interface GameBackground {
  id: string;
  name: string;
  imageUrl: string;
  type: 'ff' | 'pubg' | 'codm' | 'standoff' | 'custom';
}

export interface AideFile {
  name: string;
  path: string;
  language: 'java' | 'xml';
  content: string;
  description: string;
}
