/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, Scale, HelpCircle, ChevronDown, CheckCircle2, Award } from 'lucide-react';

export const SecurityPolicies: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'disclaimer' | 'faq'>('privacy');
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({
    0: true,
    1: false,
    2: false,
  });

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const speakAuthor = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Ứng dụng được thiết kế bởi Đình Quang. Chúc các bạn chơi game vui vẻ!");
      utterance.lang = 'vi-VN';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      
      if (typeof window.speechSynthesis.getVoices === 'function') {
        const voices = window.speechSynthesis.getVoices();
        const viVoice = voices.find(v => v.lang.startsWith('vi'));
        if (viVoice) {
          utterance.voice = viVoice;
        }
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
      
      {/* Component Header with Hidden Branding Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/85 pb-4">
        <div>
          <h2 
            className="text-lg font-bold text-white flex items-center gap-2 cursor-pointer hover:text-emerald-400 transition-colors"
            onClick={speakAuthor}
            title="Chạm để nghe danh tính nhà phát triển"
          >
            <ShieldCheck className="h-5 w-5 text-emerald-450 text-emerald-400" />
            Trung Tâm Chính Sách & Pháp Lý Toàn Cầu
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Các văn bản pháp hành chính thức, bảo vệ thông tin người dùng và cam kết hoạt động an toàn.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-850">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">ĐÌNH QUANG SECURE</span>
        </div>
      </div>

      {/* Modern Horizontal Glass Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/70 rounded-xl border border-slate-850/60 text-xs">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`py-2 px-1 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'privacy'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'border border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="h-3.5 w-3.5 shrink-0" />
          <span className="hidden sm:inline">Quyền Riêng Tư</span>
          <span className="inline sm:hidden">R.Tư</span>
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`py-2 px-1 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'terms'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'border border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="h-3.5 w-3.5 shrink-0" />
          <span className="hidden sm:inline">Điều Khoản</span>
          <span className="inline sm:hidden">Đ.Khoản</span>
        </button>

        <button
          onClick={() => setActiveTab('disclaimer')}
          className={`py-2 px-1 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'disclaimer'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'border border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="h-3.5 w-3.5 shrink-0" />
          <span className="hidden sm:inline">Miễn Trách</span>
          <span className="inline sm:hidden">M.Trách</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`py-2 px-1 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'faq'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'border border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="h-3.5 w-3.5 shrink-0" />
          <span>Hỏi Đáp</span>
        </button>
      </div>

      {/* Tab Panels with Rich Information */}
      <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl min-h-[180px] flex flex-col justify-between">
        
        {activeTab === 'privacy' && (
          <div className="space-y-3 text-xs leading-relaxed animate-in fade-in duration-200">
            <h3 className="font-bold text-slate-200 flex items-center gap-1 text-[13px]">
              <Lock className="h-4 w-4 text-emerald-400" />
              Chính Sách Bảo Mật Quyền Riêng Tư (Privacy Policy)
            </h3>
            <p className="text-slate-400 text-[11px]">
              Bảo mật dữ liệu cá nhân là ưu tiên hàng đầu của chúng tôi. Ứng dụng Tâm Ảo Pro tự hào cam kết hoạt động độc lập không phụ thuộc máy chủ trung gian:
            </p>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-white">Không thu thập thông tin:</strong> Ứng dụng hoạt động 100% cục bộ (offline) trên thiết bị di động của bạn. Không ghi lại phím bấm, hình ảnh hay thông số ứng dụng chạy song song.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-white">Giới hạn quyền overlay:</strong> Quyền vẽ trên ứng dụng khác (SYSTEM_ALERT_WINDOW) chỉ được khai thác duy nhất cho tác vụ hiển thị hình mô phỏng tâm ngắm đồ họa và bong bóng chứa nút điều khiển nhanh.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-white">Không quảng cáo ngầm:</strong> Không gửi dữ liệu truyền thông, không chia sẻ với bên thứ ba dưới bất kỳ hình thức nào.</span>
              </li>
            </ul>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-3 text-xs leading-relaxed animate-in fade-in duration-200">
            <h3 className="font-bold text-slate-200 flex items-center gap-1 text-[13px]">
              <FileText className="h-4 w-4 text-emerald-400" />
              Điều Khoản Sử Dụng Sử Dụng Thiết Bị (Terms of Service)
            </h3>
            <p className="text-slate-400 text-[11px]">
              Khi bạn khởi chạy ứng dụng này, bạn mặc định đồng ý với toàn bộ các điều ước sử dụng dưới đây:
            </p>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-white">Sử dụng hợp lệ:</strong> Công cụ thiết kế nhằm hỗ trợ người có thị lực yếu hoặc hỗ trợ tập luyện ngắm bắn pháo binh/phản xạ vật lý trong khuôn khổ tập luyện offline.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-white">Ý thức người dùng:</strong> Tránh lạm dụng để gây ảnh hưởng tiêu cực hay xúc phạm cộng đồng người chơi khác. Hãy luôn chơi game một cách lành mạnh và thượng võ.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-white">Bảo mật mã nguồn gốc:</strong> Bạn không được chỉnh sửa dịch ngược trái phép biểu tượng hay bẻ khóa dữ liệu phân phối thương mại khi không được Đình Quang chấp thuận.</span>
              </li>
            </ul>
          </div>
        )}

        {activeTab === 'disclaimer' && (
          <div className="space-y-3 text-xs leading-relaxed animate-in fade-in duration-200">
            <h3 className="font-bold text-slate-200 flex items-center gap-1 text-[13px]">
              <Scale className="h-4 w-4 text-emerald-400" />
              Tuyên Bố Miễn Trừ Trách Nhiệm (Disclaimer)
            </h3>
            <p className="text-slate-400 text-[11px]">
              Ứng dụng mang tính chất giả lập huấn luyện và cung cấp phương tiện đồ họa trợ thủ hỗ trợ người dùng định vị tọa độ màn hình vật lý:
            </p>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-white">An toàn tuyệt hảo:</strong> Vì tâm ảo hoạt động độc lập dưới dạng cửa sổ nổi vẽ đè của Android, nó hoàn toàn KHÔNG CÓ khả năng can thiệp hay sửa đổi tập tin hệ thống của các nhà phát hành game (Garena, Tencent, v.v.).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-white">Trách nhiệm pháp lý:</strong> Đình Quang được miễn trừ các trách nhiệm liên quan đến tranh chấp tài khoản cá nhân hoặc lỗi cấu hình hệ điều hành tùy biến do người dùng tự phân nhánh.</span>
              </li>
            </ul>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-2 animate-in fade-in duration-200 text-xs">
            {/* FAQ 1 */}
            <div className="border-b border-slate-900 pb-1.5">
              <button 
                onClick={() => toggleFaq(0)} 
                className="w-full flex items-center justify-between text-left font-bold text-slate-200 text-[11px] hover:text-white py-1"
              >
                <span>Hỏi: Ứng dụng có gây banacc (khóa tài khoản) không?</span>
                <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform ${faqOpen[0] ? 'rotate-180' : ''}`} />
              </button>
              {faqOpen[0] && (
                <p className="text-slate-450 text-[10.5px] mt-1 pl-1 leading-normal text-slate-400">
                  Đáp: Tuyệt đối không. Vì đây hoàn toàn là widget vẽ đè hệ thống thuộc hệ điều hành di động, không hook API, không chỉnh sửa file nội dung game nên hệ thống chống hack của game nhận diện đây giống như một miếng dán decal màu dán trên kính màn hình của bạn.
                </p>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="border-b border-slate-900 pb-1.5">
              <button 
                onClick={() => toggleFaq(1)} 
                className="w-full flex items-center justify-between text-left font-bold text-slate-200 text-[11px] hover:text-white py-1"
              >
                <span>Hỏi: Làm thế nào để điều phối căn chỉnh khi tâm lệch lệch?</span>
                <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform ${faqOpen[1] ? 'rotate-180' : ''}`} />
              </button>
              {faqOpen[1] && (
                <p className="text-slate-450 text-[10.5px] mt-1 pl-1 leading-normal text-slate-400">
                  Đáp: Bạn vui lòng sử dụng "Phím Căn Biên Trục" ngay trong Menu Trổi hoặc điều phối tọa độ chi tiết X / Y ở bảng thiết kế kỹ thuật bên trái để khớp 100% với màn hình các hãng điện thoại khác nhau.
                </p>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="pb-0.5">
              <button 
                onClick={() => toggleFaq(2)} 
                className="w-full flex items-center justify-between text-left font-bold text-slate-200 text-[11px] hover:text-white py-1"
              >
                <span>Hỏi: Ai là người phát triển hệ quản lý phần mềm này?</span>
                <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform ${faqOpen[2] ? 'rotate-180' : ''}`} />
              </button>
              {faqOpen[2] && (
                <p className="text-slate-450 text-[10.5px] mt-1 pl-1 leading-normal text-slate-400">
                  Đáp: Toàn bộ hệ thống giả lập và điều phối tâm ảo được thiết kế tỉ mỉ bởi nhà phát triển tài năng Đình Quang, phát hành hướng đến cộng đồng lập trình viên di động AIDE.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Dynamic Author signature footer */}
        <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <Award className="h-3 w-3 text-amber-500" />
            Đồng bộ hệ thống dữ liệu mã hóa toàn cầu MD5
          </span>
          <span className="font-medium text-slate-400">Designed & Verified by @Đình Quang</span>
        </div>

      </div>

    </div>
  );
};
