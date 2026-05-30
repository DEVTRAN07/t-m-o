/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CrosshairConfig } from './types';
import { CrosshairDesigner } from './components/CrosshairDesigner';
import { GamePreview } from './components/GamePreview';
import { PresetsManager } from './components/PresetsManager';
import { SecurityPolicies } from './components/SecurityPolicies';
import { AIOptimizerHub } from './components/AIOptimizerHub';
import { ShieldCheck, Zap, Info, Smartphone, FileText, Target } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<CrosshairConfig>({
    name: 'Tâm Điểm Classic',
    shape: 'cross',
    size: 40,
    color: '#33FF33',
    opacity: 0.9,
    thickness: 3,
    gap: 6,
    hasDot: true,
    dotSize: 4,
    dotColor: '#FF3333',
    outlineColor: '#000000',
    outlineThickness: 1,
    hasOutline: true,
    rotation: 0,
    offsetX: 0,
    offsetY: 0
  });

  const handleApplyPreset = (preset: CrosshairConfig) => {
    setConfig(preset);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Dynamic Header HUD */}
      <header className="relative overflow-hidden border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 py-4 px-6">
        {/* Glow decoration */}
        <div className="absolute top-0 left-1/4 w-96 h-12 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-emerald-400/30">
              <Target className="h-6 w-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black tracking-wider text-white uppercase">
                  Tâm Ảo Pro Maker
                </h1>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-900 uppercase tracking-widest">
                  Overlay System
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Thiết kế tâm ngắm tùy biến & Giả lập dịch vụ vẽ đè hoàn hảo trên mọi điện thoại
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="hidden lg:flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <div>
                <div className="font-bold text-slate-350">AN TOÀN TUYỆT ĐỐI</div>
                <div className="text-[9px] text-slate-500">Mã Android Overlay gốc</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <Zap className="h-4 w-4 text-amber-400 animate-pulse" />
              <div>
                <div className="font-bold text-slate-350">SIÊU MƯỢT ỔN ĐỊNH</div>
                <div className="text-[9px] text-slate-500">Bypass cảm ứng hoàn toàn</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <Smartphone className="h-4 w-4 text-cyan-400" />
              <div>
                <div className="font-bold text-slate-350">100% ĐỘC LẬP AN TOÀN</div>
                <div className="text-[9px] text-slate-500">Hỗ trợ đầy đủ thiết bị di động</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Banner Infotype alerts */}
        <section className="bg-gradient-to-r from-emerald-950/30 to-slate-900/40 p-4 rounded-2xl border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 self-start">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Tìm hiểu về cách công nghệ hệ thống Overlay hoạt động</h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Tâm ảo hoạt động thông qua một dịch vụ chạy ngầm của hệ thống, sử dụng 
                <strong className="text-slate-300"> System Overlay Window (Cửa sổ vẽ đè hệ thống)</strong>. Hoàn toàn không can thiệp vào file game,
                không đọc bộ nhớ hay hook mạng, giúp bạn chơi game nhắm bắn chuẩn xác mà tuyệt đối an toàn với tài khoản game!
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left panel: Presets + Designer parameters (column width: 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Presets */}
            <PresetsManager currentConfig={config} onApplyPreset={handleApplyPreset} />

            {/* 2. Designer Customizer */}
            <CrosshairDesigner config={config} onChangeConfig={setConfig} />

          </div>

          {/* Right panel: Game Simulator Previewer + Exporter code (column width: 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Live Interactive Battlefield Simulator */}
            <GamePreview config={config} onChangeConfig={setConfig} />

            {/* 2. Security policies, terms and developer details */}
            <SecurityPolicies />

            {/* 3. AI Hardware Optimizer & Sensitivity Calibration Panel */}
            <AIOptimizerHub />

          </div>
        </div>
      </main>

      {/* Footer copyright HUD details */}
      <footer className="mt-auto border-t border-slate-900 py-4 px-6 bg-slate-950/50 text-center">
        <div className="max-w-7xl mx-auto text-[10px] text-slate-500 tracking-wider">
          &copy; {new Date().getFullYear()} TÂM ẢO PRO MAKER &bull; THIẾT KẾ BỞI ĐÌNH QUANG TRÊN NỀN TẢNG AIDE DI ĐỘNG &bull; ALL RIGHTS RESERVED
        </div>
      </footer>
    </div>
  );
}

