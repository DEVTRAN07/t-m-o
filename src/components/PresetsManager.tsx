/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CrosshairConfig } from '../types';
import { Sparkles, Save, Trash, Plus, FileSpreadsheet, Check } from 'lucide-react';

interface PresetsManagerProps {
  currentConfig: CrosshairConfig;
  onApplyPreset: (config: CrosshairConfig) => void;
}

const DEFAULT_PRESETS: CrosshairConfig[] = [
  {
    id: 'preset-close-dot',
    name: 'Sát Thủ Chấm Đỏ',
    shape: 'dot',
    size: 24,
    color: '#FF3333',
    opacity: 0.9,
    thickness: 2,
    gap: 0,
    hasDot: true,
    dotSize: 8,
    dotColor: '#FF3333',
    outlineColor: '#000000',
    outlineThickness: 1.5,
    hasOutline: true,
    rotation: 0,
    offsetX: 0,
    offsetY: 0
  },
  {
    id: 'preset-cs-classic',
    name: 'Thập Tự Kinh Điển (+)',
    shape: 'cross',
    size: 40,
    color: '#33FF33',
    opacity: 0.85,
    thickness: 3.5,
    gap: 8,
    hasDot: false,
    dotSize: 4,
    dotColor: '#33FF33',
    outlineColor: '#000000',
    outlineThickness: 1.5,
    hasOutline: true,
    rotation: 0,
    offsetX: 0,
    offsetY: 0
  },
  {
    id: 'preset-fast-scope',
    name: 'Gia Lực Ngắm Bắn',
    shape: 'target',
    size: 55,
    color: '#33FFFF',
    opacity: 0.95,
    thickness: 2.5,
    gap: 5,
    hasDot: true,
    dotSize: 6,
    dotColor: '#FF3333',
    outlineColor: '#000000',
    outlineThickness: 1,
    hasOutline: true,
    rotation: 0,
    offsetX: 0,
    offsetY: 0
  },
  {
    id: 'preset-chevron-tactical',
    name: 'Xạ Thủ Mũ Quân Hàm',
    shape: 'chevron',
    size: 32,
    color: '#FFFF33',
    opacity: 0.9,
    thickness: 3.5,
    gap: 0,
    hasDot: false,
    dotSize: 4,
    dotColor: '#FFFF33',
    outlineColor: '#000000',
    outlineThickness: 1,
    hasOutline: true,
    rotation: 0,
    offsetX: 0,
    offsetY: 0
  },
  {
    id: 'preset-diamond-arena',
    name: 'Góc Nhìn Đấu Trường',
    shape: 'diamond',
    size: 38,
    color: '#FF33FF',
    opacity: 0.8,
    thickness: 2,
    gap: 0,
    hasDot: true,
    dotSize: 4,
    dotColor: '#FFFFFF',
    outlineColor: '#000000',
    outlineThickness: 1.5,
    hasOutline: true,
    rotation: 45,
    offsetX: 0,
    offsetY: 0
  },
  {
    id: 'preset-troll-smile',
    name: 'Mặt Cười Giải Trí ☺',
    shape: 'smiley',
    size: 60,
    color: '#FFFF33',
    opacity: 0.85,
    thickness: 3,
    gap: 0,
    hasDot: false,
    dotSize: 4,
    dotColor: '#FFFF33',
    outlineColor: '#000000',
    outlineThickness: 1,
    hasOutline: true,
    rotation: 0,
    offsetX: 0,
    offsetY: 0
  }
];

export const PresetsManager: React.FC<PresetsManagerProps> = ({ currentConfig, onApplyPreset }) => {
  const [customPresets, setCustomPresets] = useState<CrosshairConfig[]>([]);
  const [newPresetName, setNewPresetName] = useState('');
  const [activePresetId, setActivePresetId] = useState<string>('preset-close-dot');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Load presets from local storage
    const stored = localStorage.getItem('aide_crosshair_presets');
    if (stored) {
      try {
        setCustomPresets(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored presets', e);
      }
    }
  }, []);

  const savePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;

    const newPreset: CrosshairConfig = {
      ...currentConfig,
      id: `custom-${Date.now()}`,
      name: newPresetName.trim()
    };

    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    localStorage.setItem('aide_crosshair_presets', JSON.stringify(updated));
    setActivePresetId(newPreset.id!);
    setNewPresetName('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const deletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customPresets.filter(p => p.id !== id);
    setCustomPresets(updated);
    localStorage.setItem('aide_crosshair_presets', JSON.stringify(updated));
  };

  const handleApply = (preset: CrosshairConfig) => {
    setActivePresetId(preset.id || '');
    onApplyPreset(preset);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          Bộ Thư Viện Tâm Mẫu
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Lựa chọn cấu hình sẵn có hoặc lưu lại bộ tâm mong muốn của bạn.
        </p>
      </div>

      {/* Built-in Presets */}
      <div className="space-y-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <FileSpreadsheet className="h-3.5 w-3.5" />
          Tâm Mẫu Có Sẵn (Gamer Pro)
        </span>
        <div className="grid grid-cols-2 gap-2.5">
          {DEFAULT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApply(preset)}
              className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] active:scale-95 flex flex-col justify-between h-[82px] relative overflow-hidden ${
                activePresetId === preset.id
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-500/10 to-transparent text-white'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-705'
              }`}
            >
              <span className="font-bold text-xs line-clamp-1 break-all uppercase tracking-wide">
                {preset.name}
              </span>
              <span className="text-[10px] text-slate-500 font-mono capitalize">
                Kiểu: {preset.shape} | S:{preset.size}
              </span>
              {activePresetId === preset.id && (
                <div className="absolute right-2 bottom-2 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Saved Presets */}
      {customPresets.length > 0 && (
        <div className="space-y-3 border-t border-slate-800/80 pt-4">
          <span className="text-xs font-semibold text-slate-450 uppercase tracking-widest block">
            Cấu Hình Bạn Đã Lưu ({customPresets.length})
          </span>
          <div className="grid grid-cols-2 gap-2.5 max-h-[200px] overflow-y-auto">
            {customPresets.map((preset) => (
              <div
                key={preset.id}
                onClick={() => handleApply(preset)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between h-[82px] relative group ${
                  activePresetId === preset.id
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-500/10 to-transparent text-white'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-705'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-xs truncate max-w-[80%] uppercase tracking-wide">
                    {preset.name}
                  </span>
                  <button
                    onClick={(e) => deletePreset(preset.id!, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-slate-600 rounded transition-all"
                    title="Xóa cấu hình"
                  >
                    <Trash className="h-3 w-3" />
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  Kiểu: {preset.shape} | X:{preset.offsetX},Y:{preset.offsetY}
                </span>

                {activePresetId === preset.id && (
                  <div className="absolute right-2 bottom-2 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Present Form */}
      <form onSubmit={savePreset} className="space-y-3 pt-3 border-t border-slate-800/80">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
          Lưu Thiết Kế Hiện Tại
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Đặt tên tâm ảo của bạn..."
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            className="flex-1 bg-slate-950 text-xs px-3.5 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500/50 text-white"
          />
          <button
            type="submit"
            className={`px-4 rounded-xl text-xs font-semibold select-none flex items-center gap-1 transition-all ${
              saveSuccess 
                ? 'bg-emerald-600 text-white border border-emerald-500' 
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-95'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[3]" /> Đã Lưu
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" /> Lưu Tâm
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
