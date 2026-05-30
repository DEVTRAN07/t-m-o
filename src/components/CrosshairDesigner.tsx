/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CrosshairConfig, CrosshairShape } from '../types';
import { Sliders, Sparkles, Paintbrush, Compass, Eye } from 'lucide-react';

interface CrosshairDesignerProps {
  config: CrosshairConfig;
  onChangeConfig: (config: CrosshairConfig) => void;
}

const QUICK_COLORS = [
  { name: 'Đỏ Neon', value: '#FF3333' },
  { name: 'Xanh Lá', value: '#33FF33' },
  { name: 'Xanh Cyan', value: '#33FFFF' },
  { name: 'Vàng Sáng', value: '#FFFF33' },
  { name: 'Hồng Sen', value: '#FF33FF' },
  { name: 'Trắng Sạch', value: '#FFFFFF' }
];

const SHAPE_NAMES: Record<CrosshairShape, string> = {
  dot: 'Chấm Tròn',
  circle: 'Vòng Tròn',
  cross: 'Thập Tự (+)',
  't-shape': 'Hình Chữ T',
  chevron: 'Mũ Quân Hàm (^)',
  diamond: 'Hình Thoi (♦)',
  smiley: 'Mặt Cười (☺)',
  target: 'Bia Ngắm',
  star: 'Ngôi Sao (✦)',
  rotating: 'Tâm Xoay (🌀)'
};

export const CrosshairDesigner: React.FC<CrosshairDesignerProps> = ({ config, onChangeConfig }) => {
  const updateProp = <K extends keyof CrosshairConfig>(key: K, value: CrosshairConfig[K]) => {
    onChangeConfig({
      ...config,
      [key]: value
    });
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Sliders className="h-5 w-5 text-emerald-400" />
          Tùy Chỉnh Thiết Kế Tâm
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Điều chỉnh các thông số trực quan của tâm ảo theo ý thích.
        </p>
      </div>

      {/* 1. Shape Selection */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Compass className="h-3.5 w-3.5 text-blue-400" />
          Kiểu Dáng Tâm ảo
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(SHAPE_NAMES) as CrosshairShape[]).map((shp) => (
            <button
              key={shp}
              onClick={() => updateProp('shape', shp)}
              className={`py-2 px-1 rounded-lg text-xs font-medium border text-center transition-all ${
                config.shape === shp
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-705 hover:text-slate-300'
              }`}
            >
              {SHAPE_NAMES[shp]}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Shape Dimensions */}
      <div className="space-y-4 border-t border-slate-800/80 pt-4">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Sliders className="h-3.5 w-3.5 text-purple-400" />
          Kích Thước & Tỷ Lệ
        </label>

        {/* Size Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300">Độ lớn Tâm (Size):</span>
            <span className="font-mono text-emerald-400 font-bold">{config.size}px</span>
          </div>
          <input
            type="range"
            min="10"
            max="120"
            step="1"
            value={config.size}
            onChange={(e) => updateProp('size', parseInt(e.target.value))}
            className="w-full accent-emerald-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Line Thickness Slider (Skip for basic Dot view) */}
        {config.shape !== 'dot' && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300">Độ dày nét vẽ (Thickness):</span>
              <span className="font-mono text-emerald-400 font-bold">{config.thickness}px</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={config.thickness}
              onChange={(e) => updateProp('thickness', parseFloat(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}

        {/* Center Gap Slider */}
        {['cross', 't-shape', 'target'].includes(config.shape) && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300">Khoảng cách trống giữa (Gap):</span>
              <span className="font-mono text-emerald-400 font-bold">{config.gap}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={config.gap}
              onChange={(e) => updateProp('gap', parseInt(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}

        {/* Rotation Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300">Góc xoay (Rotation):</span>
            <span className="font-mono text-emerald-400 font-bold">{config.rotation}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="5"
            value={config.rotation}
            onChange={(e) => updateProp('rotation', parseInt(e.target.value))}
            className="w-full accent-emerald-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* 3. Color & Opacity (Aesthetic design elements) */}
      <div className="space-y-4 border-t border-slate-800/80 pt-4">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Paintbrush className="h-3.5 w-3.5 text-amber-400" />
          Màu Sắc & Độ mờ
        </label>

        {/* Palette Grid */}
        <div className="space-y-2">
          <span className="text-slate-400 text-xs block">Chọn màu nhanh:</span>
          <div className="grid grid-cols-6 gap-2">
            {QUICK_COLORS.map((clr) => (
              <button
                key={clr.value}
                onClick={() => {
                  updateProp('color', clr.value);
                  // Sync Dot Color too for cohesive theme
                  if (!config.hasDot) {
                    updateProp('dotColor', clr.value);
                  }
                }}
                className={`w-full aspect-square rounded-lg border-2 transition-transform active:scale-95 ${
                  config.color.toUpperCase() === clr.value.toUpperCase()
                    ? 'border-white scale-105 shadow-md shadow-slate-950'
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: clr.value }}
                title={clr.name}
              />
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-300">Mã màu tùy chọn:</span>
          <input
            type="color"
            value={config.color}
            onChange={(e) => updateProp('color', e.target.value)}
            className="bg-transparent cursor-pointer w-8 h-8 rounded overflow-hidden p-0 border border-slate-800"
          />
          <input
            type="text"
            value={config.color.toUpperCase()}
            onChange={(e) => updateProp('color', e.target.value)}
            className="bg-slate-950 text-slate-300 text-xs font-mono px-2 py-1 rounded border border-slate-800 w-24 text-center"
          />
        </div>

        {/* Opacity Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300">Độ đậm nhạt (Opacity):</span>
            <span className="font-mono text-emerald-400 font-bold">{Math.round(config.opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={config.opacity}
            onChange={(e) => updateProp('opacity', parseFloat(e.target.value))}
            className="w-full accent-emerald-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* 4. Center Dot Options */}
      <div className="space-y-4 border-t border-slate-800/80 pt-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-rose-400" />
            Nhân Điểm Tâm (Center Dot)
          </label>
          <input
            type="checkbox"
            checked={config.hasDot}
            onChange={(e) => updateProp('hasDot', e.target.checked)}
            className="w-4 h-4 cursor-pointer accent-emerald-500 bg-slate-950 rounded"
          />
        </div>

        {config.hasDot && (
          <div className="grid grid-cols-2 gap-4 animate-fade-in pl-3 border-l-2 border-slate-800">
            {/* Dot Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Độ lớn chấm:</span>
                <span className="font-mono text-emerald-400 font-bold">{config.dotSize}px</span>
              </div>
              <input
                type="range"
                min="2"
                max="24"
                step="1"
                value={config.dotSize}
                onChange={(e) => updateProp('dotSize', parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950 h-1 rounded appearance-none cursor-pointer"
              />
            </div>

            {/* Dot Color */}
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 block">Màu chấm tâm:</span>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={config.dotColor}
                  onChange={(e) => updateProp('dotColor', e.target.value)}
                  className="bg-transparent cursor-pointer w-6 h-6 rounded overflow-hidden p-0 border border-slate-800"
                />
                <input
                  type="text"
                  value={config.dotColor.toUpperCase()}
                  onChange={(e) => updateProp('dotColor', e.target.value)}
                  className="bg-slate-950 text-slate-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-800 w-16 text-center"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Outer Outline Options */}
      <div className="space-y-4 border-t border-slate-800/80 pt-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-yellow-400" />
            Đường Viền Ngoại (Outline)
          </label>
          <input
            type="checkbox"
            checked={config.hasOutline}
            onChange={(e) => updateProp('hasOutline', e.target.checked)}
            className="w-4 h-4 cursor-pointer accent-emerald-500 bg-slate-950 rounded"
          />
        </div>

        {config.hasOutline && (
          <div className="grid grid-cols-2 gap-4 animate-fade-in pl-3 border-l-2 border-slate-800">
            {/* Outline thickness */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Độ dày viền đen:</span>
                <span className="font-mono text-emerald-400 font-bold">{config.outlineThickness}px</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6"
                step="0.5"
                value={config.outlineThickness}
                onChange={(e) => updateProp('outlineThickness', parseFloat(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950 h-1 rounded appearance-none cursor-pointer"
              />
            </div>

            {/* Outline Color */}
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 block">Màu đường viền:</span>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={config.outlineColor}
                  onChange={(e) => updateProp('outlineColor', e.target.value)}
                  className="bg-transparent cursor-pointer w-6 h-6 rounded overflow-hidden p-0 border border-slate-800"
                />
                <input
                  type="text"
                  value={config.outlineColor.toUpperCase()}
                  onChange={(e) => updateProp('outlineColor', e.target.value)}
                  className="bg-slate-950 text-slate-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-800 w-16 text-center"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
