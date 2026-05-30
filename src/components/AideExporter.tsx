/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CrosshairConfig } from '../types';
import { getAideTemplates } from '../aideTemplates';
import { Copy, Check, FileCode, Folder, BookOpen, Smartphone, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface AideExporterProps {
  config: CrosshairConfig;
}

export const AideExporter: React.FC<AideExporterProps> = ({ config }) => {
  const templates = getAideTemplates(config);
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const activeTemplate = templates[selectedFileIdx] || templates[0];

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
      } catch (copyErr) {
        console.error('Không thể sao chép: ', copyErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleDownloadAllAsInstructions = () => {
    // Generates a bundled instructions file with containing clean separators
    let content = `========================================================\n`;
    content += `      HƯỚNG DẪN BIÊN DỊCH NATIVE APK CHẠY TRÊN ĐIỆN THOẠI\n`;
    content += `         SỬ DỤNG ỨNG DỤNG AIDE (ANDROID IDE) DI ĐỘNG\n`;
    content += `========================================================\n\n`;
    content += `Được tạo bởi: Tâm Ảo Pro Maker - Đình Quang\n`;
    content += `Cấu hình tâm hiện tại: ${config.name} (Kiểu dáng: ${config.shape}, Màu sắc: ${config.color})\n\n`;
    content += `--------------------------------------------------------\n`;
    content += `HƯỚNG DẪN 3 BƯỚC ĐƠN GIẢN CHẠY TRÊN ĐIỆN THOẠI:\n`;
    content += `--------------------------------------------------------\n`;
    content += `BƯỚC 1: Tải và cài đặt ứng dụng AIDE (Android Interactive Development Environment) về điện thoại Android của bạn thông qua Google Play hoặc tải tệp .APK từ các diễn đàn bảo mật Việt Nam.\n\n`;
    content += `BƯỚC 2: Tạo một ứng dụng Android mới trên AIDE (chọn "Create New Android Application").\n\n`;
    content += `BƯỚC 3: Thay thế nội dung của các tệp nguồn trong AIDE bằng các mã nguồn tương ứng được liệt kê chi tiết dưới đây. Luôn nhớ đặt chính xác đúng tên tệp và đường dẫn thư mục nguồn.\n\n`;
    content += `BƯỚC 4: Nhấn nút RUN (Biểu tượng tam giác Play) trong ứng dụng AIDE để nó tự động biên dịch trực tiếp sang tệp ứng dụng cài đặt (.APK). Tiếp tục đồng ý cấp quyền "Draw over other apps" (Vẽ lên trên ứng dụng khác) trong cài đặt thiết bị để kích hoạt hiển thị tâm ảo nổi hoàn hảo ngoài màn hình điện thoại!\n\n`;

    templates.forEach((t) => {
      content += `\n\n========================================================\n`;
      content += `TÊN FILE: ${t.name}\n`;
      content += `ĐƯỜNG DẪN PHẢI LƯU TRONG THƯ MỤC DỰ ÁN: \n${t.path}\n`;
      content += `MÔ TẢ CHI TIẾT: ${t.description}\n`;
      content += `========================================================\n\n`;
      content += t.content;
      content += `\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ma_Nguon_AIDE_Tam_Ao_Pro_${config.shape}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="aide-code-exporter" className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
      
      {/* Header and description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-emerald-400" />
            Trình Xuất Bản Mã Nguồn Gốc (AIDE)
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Thiết kế của bạn được chuyển đổi trực tiếp thành mã lập trình Java & XML nguyên bản. Copy và nạp vào điện thoại của bạn thông qua ứng dụng <strong className="text-emerald-400 font-medium">AIDE</strong> hoặc <strong className="text-emerald-400 font-medium">Android Studio</strong> để tạo APK chạy độc lập hoàn hảo ngoài màn hình chính của máy!
          </p>
        </div>

        <button 
          onClick={handleDownloadAllAsInstructions}
          className="shrink-0 text-xs px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold rounded-xl transition-all hover:brightness-110 active:scale-95 shadow-md shadow-emerald-900/20 cursor-pointer flex items-center gap-1.5"
        >
          <FileCode className="h-4 w-4" />
          Tải file trọn bộ (.TXT)
        </button>
      </div>

      {/* Code panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Side: Directory Structure / Clickable Tabs */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block pl-1 select-none">
            Cấu trúc thư mục Android Project
          </span>
          <div className="bg-slate-950/65 rounded-xl border border-slate-850 p-2 space-y-1 max-h-[300px] overflow-y-auto">
            {templates.map((t, idx) => (
              <button
                key={t.name}
                onClick={() => setSelectedFileIdx(idx)}
                className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start gap-2.5 cursor-pointer ${
                  selectedFileIdx === idx
                    ? 'bg-slate-800 border border-slate-700 text-emerald-400'
                    : 'border border-transparent hover:bg-slate-900/60 text-slate-400'
                }`}
              >
                {t.name.endsWith('.java') ? (
                  <FileCode className={`h-4 w-4 shrink-0 mt-0.5 ${selectedFileIdx === idx ? 'text-emerald-400' : 'text-amber-500/80'}`} />
                ) : (
                  <Folder className={`h-4 w-4 shrink-0 mt-0.5 ${selectedFileIdx === idx ? 'text-emerald-400' : 'text-sky-500/80'}`} />
                )}
                <div className="min-w-0">
                  <div className="text-[11px] font-bold truncate leading-tight">{t.name}</div>
                  <div className="text-[9px] text-slate-500 truncate mt-0.5 font-mono">{t.path}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Code Viewer & Actions */}
        <div className="lg:col-span-8 flex flex-col h-full space-y-3">
          <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-t-xl border-t border-x border-slate-850">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-slate-500 tracking-wide">
                ĐƯỜNG DẪN: {activeTemplate.path}
              </span>
              <span className="text-slate-300 font-bold text-[9.5px] mt-0.5">
                {activeTemplate.description}
              </span>
            </div>

            <button
              onClick={() => handleCopy(activeTemplate.content, selectedFileIdx)}
              className={`text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                copiedIdx === selectedFileIdx
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {copiedIdx === selectedFileIdx ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  Đã sao chép!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Sao chép mã
                </>
              )}
            </button>
          </div>

          {/* Actual Code Viewer Wrapper */}
          <div className="relative bg-slate-950 rounded-b-xl border border-slate-850 p-4 h-[350px] overflow-y-auto font-mono text-xs text-slate-300 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950">
            <pre className="whitespace-pre overflow-x-auto leading-relaxed select-all">
              {activeTemplate.content}
            </pre>
          </div>
        </div>
      </div>

      {/* Guide Section */}
      <section className="bg-gradient-to-r from-emerald-900/10 via-teal-900/5 to-slate-900/30 p-4 rounded-xl border border-emerald-500/15">
        <div className="flex gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 self-start">
            <BookOpen className="h-4.5 w-4.5" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              💡 HƯỚNG DẪN BIÊN DỊCH APK ĐẬP TAN GIẢ LẬP TRong 2 PHÚT
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10.5px] leading-relaxed text-slate-400">
              <div className="space-y-1.5">
                <p>
                  <strong className="text-white">1. Chuẩn bị AIDE trên điện thoại:</strong>
                  <br />Tải ứng dụng <strong className="text-emerald-400">AIDE - Android IDE</strong> từ CH Play hoặc các trang uy tín về điện thoại trực tiếp của bạn.
                </p>
                <p>
                  <strong className="text-white">2. Tạo dự án mới:</strong>
                  <br />Mở ứng dụng AIDE lên ➔ Chọn "Create New Project" (Dự án mới) ➔ Chọn kiểu "Android Application" (Ứng dụng Java thuần cấu trúc SDK).
                </p>
              </div>

              <div className="space-y-1.5">
                <p>
                  <strong className="text-white">3. Dán Mã Nguồn Tương Thích:</strong>
                  <br />Dùng các tab bên trên để copy mã đã biên tập và ghi đè nội dung các tệp tin trong cấu trúc thư mục AIDE trên ứng dụng điện thoại tương ứng.
                </p>
                <p>
                  <strong className="text-white">4. Bấm Run & Chơi Game:</strong>
                  <br />Nhấn vào nút Tam giác RUN màu xanh ở thanh Menu AIDE. Nó sẽ gom tệp và ra mắt file cài đặt <strong className="text-emerald-400">Tâm Ảo Pro (.APK)</strong>. Cài đặt vào máy, cấp quyền vẽ đè và kích hoạt để sấy game cực chuẩn!
                </p>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                Mã nguồn an toàn 100%, tự vẽ bằng hàm Canvas Android gốc không can thiệp vào bộ nhớ tạm của game.
              </span>
              <span className="flex items-center gap-1 font-bold text-slate-400">
                <Zap className="h-3 w-3 text-amber-500" />
                Đồng bộ hóa trực tiếp với mọi tùy chọn thiết kế bạn làm trong tab Customizer!
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
