/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { CrosshairConfig, GameBackground } from '../types';
import { CrosshairRender } from './CrosshairRender';
import { Target, Play, ShieldAlert, RotateCcw, Move, Sparkles, Sliders, Smartphone, Cpu, HelpCircle, RefreshCw, Eye, EyeOff, Zap, Shield, Flame, Volume2 } from 'lucide-react';

interface GamePreviewProps {
  config: CrosshairConfig;
  onChangeConfig: (config: CrosshairConfig) => void;
}

const DEFAULT_BACKGROUNDS: GameBackground[] = [
  {
    id: 'ff-desert',
    name: 'Free Fire - Sa Mạc Bermuda',
    type: 'ff',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000' // Gaming setup
  },
  {
    id: 'pubg-erangel',
    name: 'PUBG Mobile - Map Erangel',
    type: 'pubg',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'codm-nuketown',
    name: 'Call of Duty - Nuketown',
    type: 'codm',
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=1000'
  }
];

interface SimulatedDevice {
  id: string;
  brand: string;
  model: string;
  resolution: string;
  notchType: 'left-dot' | 'center-pill' | 'center-drop' | 'none';
  notchSize: number; // in pixels
  compensateX: number;
  compensateY: number;
}

const SIMULATED_DEVICES: SimulatedDevice[] = [
  {
    id: 'xiaomi-poco',
    brand: 'Xiaomi',
    model: 'POCO F5 Pro / Redmi Note 13',
    resolution: '2400 x 1080 (20:9)',
    notchType: 'left-dot',
    notchSize: 48,
    compensateX: -24,
    compensateY: 0
  },
  {
    id: 'samsung-s24',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra / A55',
    resolution: '2340 x 1085 (19.5:9)',
    notchType: 'center-drop',
    notchSize: 52,
    compensateX: 0,
    compensateY: -26
  },
  {
    id: 'iphone-pro',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max (Dynamic Island)',
    resolution: '2796 x 1290 (19.5:9)',
    notchType: 'center-pill',
    notchSize: 85,
    compensateX: 0,
    compensateY: -35
  },
  {
    id: 'gaming-rog',
    brand: 'ASUS',
    model: 'ROG Phone 8 / Classic Non-Notch',
    resolution: '2448 x 1080 (20.4:9)',
    notchType: 'none',
    notchSize: 0,
    compensateX: 0,
    compensateY: 0
  }
];

export const GamePreview: React.FC<GamePreviewProps> = ({ config, onChangeConfig }) => {
  const [activeBg, setActiveBg] = useState<GameBackground>(DEFAULT_BACKGROUNDS[0]);
  const [customUrl, setCustomUrl] = useState('');
  const [animState, setAnimState] = useState<'idle' | 'firing' | 'aiming'>('idle');
  const [isAutoFiring, setIsAutoFiring] = useState(false);
  const [showMockUi, setShowMockUi] = useState(true);
  
  // Trạng thái Mô Phỏng Widget & Panel Điều Khiển Nổi
  const [isCrosshairVisible, setIsCrosshairVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [widgetPos, setWidgetPos] = useState({ x: 30, y: 150 });
  const [isDragging, setIsDragging] = useState(false);

  // Chức năng nâng cao trong Menu Game
  const [autoGhìmTâm, setAutoGhìmTâm] = useState(false);
  const [mứcGiảmGiật, setMứcGiảmGiật] = useState(45); // %
  const [dạQuangBảnĐồ, setDạQuangBảnĐồ] = useState(false);
  const [giảmRungLắc, setGiảmRungLắc] = useState(true);
  const [độTrễPhảnHồi, setĐộTrễPhảnHồi] = useState('1ms');
  const [mượtCảmỨng, setMượtCảmỨng] = useState(true);

  const dragStart = useRef({ x: 0, y: 0 });
  const widgetStartPos = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const voiceIndexRef = useRef(0);
  const [giongNoi, setGiongNoi] = useState<'nam' | 'nu' | 'robot' | 'funny'>('nu');
  const [selectedFfVersion, setSelectedFfVersion] = useState<'ffth' | 'ffm'>('ffth');
  const [selectedPubgVersion, setSelectedPubgVersion] = useState<'pubgvn' | 'pubgglobal'>('pubgvn');
  const [selectedCodmVersion, setSelectedCodmVersion] = useState<'codmvn' | 'codmglobal'>('codmvn');

  const handleSpeakDev = (selectedVoiceType?: 'nam' | 'nu' | 'robot' | 'funny') => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        
        let activeVoiceType = selectedVoiceType;
        if (!activeVoiceType) {
          const types: Array<'nam' | 'nu' | 'robot' | 'funny'> = ['nam', 'nu', 'robot', 'funny'];
          activeVoiceType = types[Math.floor(Math.random() * types.length)];
          setGiongNoi(activeVoiceType);
        }
        
        let PHRASES = [
          "Ứng dụng được thiết kế bởi Đình Quang .",
          "Chào mừng bạn đến với tâm ảo pro . Thiết kế bởi Đình Quang .",
          "Kích hoạt bảng menu thành công . Được lập trình bởi Đình Quang .",
          "Hệ thống định vị tâm ảo cực đỉnh . Đình Quang thiết kế .",
          "Chúc bạn leo rank mượt mà . Sản phẩm độc quyền của Đình Quang .",
          "Tâm ngắm chuẩn từng mili mét . Thiết kế cao cấp bởi Đình Quang ."
        ];
        
        // Custom robotic or funny phrases if selected
        if (activeVoiceType === 'robot') {
          PHRASES = [
            "Tít tít ! Cảnh báo hệ thống ! Tiến trình định vị khởi động bởi ĐÌNH QUANG .",
            "Dữ liệu tối ưu ! Thiết kế chính chủ Đình Quang chấm ai .",
            "Mã nguồn tối ưu lực giật an toàn ! Hỗ trợ bởi ĐÌNH QUANG .",
            "Robot ghi nhận mở bảng quản trị thành công ! Bản quyền Đình Quang ."
          ];
        } else if (activeVoiceType === 'funny') {
          PHRASES = [
            "Úi xời ! Menu của sếp Đình Quang đã lên sóng rồi nhé ! Quá đã !",
            "Tâm mượt thế này không kéo ngắm thì hơi phí ! Đình Quang thiết kế !",
            "Chào sếp ! Đình Quang chúc sếp bắn đâu trúng đó , gánh tạ cực sung !",
            "Tâm ảo pro vương giả , Đỉnh cao công nghệ của Đình Quang !"
          ];
        } else if (activeVoiceType === 'nam') {
          PHRASES = [
            "Hệ thống điều phối tâm ảo khởi động . Đình Quang thiết kế .",
            "Cấu hình nhạy hai trăm bốn mươi hẹc đã sẵn sàng . Lập trình bởi Đình Quang .",
            "Khóa chống rung lắc cảm biến con quay . Bản quyền Đình Quang .",
            "Căn chỉnh hồng ngoại tâm ảo thành công . Thiết kế Đình Quang ."
          ];
        }
        
        const phrase = PHRASES[voiceIndexRef.current % PHRASES.length];
        voiceIndexRef.current += 1;
        
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = 'vi-VN';
        
        // Custom rate and pitch for extreme clarity in Vietnamese
        if (activeVoiceType === 'nu') {
          utterance.rate = 0.76;  // Slow, ultra-clear
          utterance.pitch = 1.35; // Slightly high-pitched
        } else if (activeVoiceType === 'nam') {
          utterance.rate = 0.74;  // Measured masculine pace
          utterance.pitch = 0.72; // Deep and robust
        } else if (activeVoiceType === 'robot') {
          utterance.rate = 0.98;  // Fast robotic monotone
          utterance.pitch = 0.35; // Deep mechanical buzz
        } else if (activeVoiceType === 'funny') {
          utterance.rate = 1.22;  // Speed up for humor
          utterance.pitch = 1.80; // High chipmunk squeak
        }
        
        if (typeof window.speechSynthesis.getVoices === 'function') {
          const voices = window.speechSynthesis.getVoices();
          const viVoices = voices.filter(v => v.lang.startsWith('vi') || v.lang.toLowerCase().includes('viet'));
          
          if (viVoices.length > 0) {
            if (activeVoiceType === 'nam') {
              // Try to find Google Nam, Microsoft Male, or any names containing "anam" or "male"
              const maleVoice = viVoices.find(v => 
                v.name.toLowerCase().includes('nam') || 
                v.name.toLowerCase().includes('male') ||
                v.name.toLowerCase().includes('an')
              );
              utterance.voice = maleVoice || viVoices[1] || viVoices[0];
            } else if (activeVoiceType === 'nu') {
              // Try to find Google Nữ, Microsoft Female, or names containing "nữ", "female", "nu"
              const femaleVoice = viVoices.find(v => 
                v.name.toLowerCase().includes('nữ') || 
                v.name.toLowerCase().includes('female') || 
                v.name.toLowerCase().includes('nu') ||
                v.name.toLowerCase().includes('hoa') ||
                v.name.toLowerCase().includes('chi')
              );
              utterance.voice = femaleVoice || viVoices[0];
            } else {
              utterance.voice = viVoices[0];
            }
          }
        }
        
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('Speech synthesis failed:', err);
      }
    }
  };

  const handleDragStart = (clientX: number, clientY: number) => {
    dragStart.current = { x: clientX, y: clientY };
    widgetStartPos.current = { x: widgetPos.x, y: widgetPos.y };
    isDraggingRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasMovedRef.current = true;
    }
    setWidgetPos({
      x: Math.max(5, Math.min(480, widgetStartPos.current.x + dx)),
      y: Math.max(5, Math.min(260, widgetStartPos.current.y + dy))
    });
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    if (!hasMovedRef.current) {
      setIsMenuOpen(prev => {
        const next = !prev;
        if (next) {
          handleSpeakDev();
        }
        return next;
      });
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    handleDragStart(e.clientX, e.clientY);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - dragStart.current.x;
      const dy = moveEvent.clientY - dragStart.current.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        hasMovedRef.current = true;
      }
      setWidgetPos({
        x: Math.max(5, Math.min(480, widgetStartPos.current.x + dx)),
        y: Math.max(5, Math.min(260, widgetStartPos.current.y + dy))
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
      if (!hasMovedRef.current) {
        setIsMenuOpen(prev => {
          const next = !prev;
          if (next) {
            handleSpeakDev();
          }
          return next;
        });
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const onHeaderMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLButtonElement || (e.target as HTMLElement).closest('button')) {
      return;
    }
    if (e.button !== 0) return;
    dragStart.current = { x: e.clientX, y: e.clientY };
    widgetStartPos.current = { x: widgetPos.x, y: widgetPos.y };
    isDraggingRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - dragStart.current.x;
      const dy = moveEvent.clientY - dragStart.current.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        hasMovedRef.current = true;
      }
      setWidgetPos({
        x: Math.max(5, Math.min(480, widgetStartPos.current.x + dx)),
        y: Math.max(5, Math.min(260, widgetStartPos.current.y + dy))
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const onHeaderTouchStart = (e: React.TouchEvent) => {
    if (e.target instanceof HTMLButtonElement || (e.target as HTMLElement).closest('button')) {
      return;
    }
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX, y: touch.clientY };
    widgetStartPos.current = { x: widgetPos.x, y: widgetPos.y };
    isDraggingRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;
  };

  const onHeaderTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];
    const dx = touch.clientX - dragStart.current.x;
    const dy = touch.clientY - dragStart.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasMovedRef.current = true;
    }
    setWidgetPos({
      x: Math.max(5, Math.min(480, widgetStartPos.current.x + dx)),
      y: Math.max(5, Math.min(260, widgetStartPos.current.y + dy))
    });
  };

  const onHeaderTouchEnd = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    handleDragEnd();
  };

  const SHAPE_CYCLES = ['cross', 'circle', 'dot', 't-shape', 'chevron', 'diamond', 'target', 'star', 'smiley', 'rotating'] as const;
  const COLOR_CYCLES = ['#33cc33', '#ff3333', '#3399ff', '#ffff33', '#ff33ff', '#ffffff'];
  const COLOR_NAMES = ['Xanh lá', 'Đỏ cực nét', 'Xanh lam', 'Vàng chanh', 'Tím Neon', 'Trắng sáng'];

  const handleCycleShape = () => {
    const nextIdx = (SHAPE_CYCLES.indexOf(config.shape as any) + 1) % SHAPE_CYCLES.length;
    onChangeConfig({
      ...config,
      shape: SHAPE_CYCLES[nextIdx]
    });
    setSysLog(prev => [`[Bóng Nổi] Thay đổi kiểu dáng: ${SHAPE_CYCLES[nextIdx].toUpperCase()}`, ...prev.slice(0, 3)]);
  };

  const handleCycleColor = () => {
    const currentIdx = COLOR_CYCLES.indexOf(config.color.toLowerCase());
    const nextIdx = (currentIdx + 1) % COLOR_CYCLES.length;
    onChangeConfig({
      ...config,
      color: COLOR_CYCLES[nextIdx]
    });
    setSysLog(prev => [`[Bóng Nổi] Áp dụng màu sắc: ${COLOR_NAMES[nextIdx]}`, ...prev.slice(0, 3)]);
  };

  // Auto-detection / Device calibration simulation states
  const [activeDevice, setActiveDevice] = useState<SimulatedDevice>(SIMULATED_DEVICES[0]);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [sysLog, setSysLog] = useState<string[]>(['[System] Sắp xếp phần cứng thành công.']);

  // Trạng thái đồng bộ với Trình Tối Ưu Hóa AI
  const [isBoosting, setIsBoosting] = useState(false);
  const [isBoosted, setIsBoosted] = useState(false);
  const [boostProgress, setBoostProgress] = useState(0);

  useEffect(() => {
    const handleStateChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setIsBoosting(customEvent.detail.isBoosting);
        setIsBoosted(customEvent.detail.isBoosted);
        setBoostProgress(customEvent.detail.boostProgress);
      }
    };

    window.addEventListener('hw-boost-state', handleStateChange);
    return () => {
      window.removeEventListener('hw-boost-state', handleStateChange);
    };
  }, []);

  const handleToggleHardwareBoost = () => {
    if (!isBoosting && !isBoosted) {
      window.dispatchEvent(new CustomEvent('trigger-hw-boost'));
      setSysLog(prev => ['[Menu Nổi] Kích hoạt tiến trình TỐI ƯU HÓA PHẦN CỨNG từ xa...', ...prev.slice(0, 3)]);
    } else if (isBoosted) {
      window.dispatchEvent(new CustomEvent('reset-hw-boost'));
      setSysLog(prev => ['[Menu Nổi] Khôi phục trạng thái hiệu năng mặc định.', ...prev.slice(0, 3)]);
    }
  };

  const handleLaunchApp = (appType: 'ffth' | 'ffm' | 'pubgvn' | 'pubgglobal' | 'codmvn' | 'codmglobal') => {
    let packageId = '';
    let scheme = '';
    let appName = '';
    let appStoreUrl = '';
    
    if (appType === 'ffth') {
      packageId = 'com.dts.freefireth';
      scheme = 'freefire';
      appName = 'Free Fire Thường';
      appStoreUrl = 'https://apps.apple.com/app/garena-free-fire/id1300142823';
    } else if (appType === 'ffm') {
      packageId = 'com.dts.freefiremax';
      scheme = 'freefiremax';
      appName = 'Free Fire MAX';
      appStoreUrl = 'https://apps.apple.com/app/garena-free-fire-max/id1480516829';
    } else if (appType === 'pubgvn') {
      packageId = 'com.vng.pubgmobile';
      scheme = 'pubgmobilevn';
      appName = 'PUBG Mobile VN (VNG)';
      appStoreUrl = 'https://apps.apple.com/app/pubg-mobile-vn/id1438396636';
    } else if (appType === 'pubgglobal') {
      packageId = 'com.tencent.ig';
      scheme = 'pubgmobile';
      appName = 'PUBG Mobile Global';
      appStoreUrl = 'https://apps.apple.com/app/pubg-mobile-3-point-0/id1330123889';
    } else if (appType === 'codmvn') {
      packageId = 'com.vng.codm';
      scheme = 'codmvn';
      appName = 'Call Of Duty Mobile VN';
      appStoreUrl = 'https://apps.apple.com/app/call-of-duty-mobile-vn/id1479860634';
    } else if (appType === 'codmglobal') {
      packageId = 'com.garena.game.codm';
      scheme = 'codm';
      appName = 'Call Of Duty Mobile Garena';
      appStoreUrl = 'https://apps.apple.com/app/vng-cloud-game-platform/id1465688043';
    }

    setSysLog(prev => [`[Liên Kết] Khởi chạy trực tiếp: ${appName}...`, ...prev.slice(0, 3)]);

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`Đang khởi chạy ${appName}. Chúc bạn có những pha ngắm chuẩn xác.`);
        utterance.lang = 'vi-VN';
        utterance.rate = 0.81;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error(err);
      }
    }

    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isAndroid) {
      const intentUrl = `intent://#Intent;package=${packageId};scheme=${scheme};end;`;
      window.location.href = intentUrl;
    } else if (isIOS) {
      const iosUrl = `${scheme}://`;
      window.location.href = iosUrl;
      setTimeout(() => {
        if (document.visibilityState === 'visible') {
          window.location.href = appStoreUrl;
        }
      }, 2000);
    } else {
      const fallbackUrl = `https://play.google.com/store/apps/details?id=${packageId}`;
      window.open(fallbackUrl, '_blank');
    }
  };
  const fireIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAutoFiring) {
      fireIntervalRef.current = setInterval(() => {
        setAnimState('firing');
        setTimeout(() => setAnimState('idle'), 80);
      }, 160);
    } else {
      if (fireIntervalRef.current) {
        clearInterval(fireIntervalRef.current);
      }
      setAnimState('idle');
    }

    return () => {
      if (fireIntervalRef.current) {
        clearInterval(fireIntervalRef.current);
      }
    };
  }, [isAutoFiring]);

  // Handle auto centering based on active selected device parameters
  const applyDeviceAutoCentering = (dev: SimulatedDevice) => {
    // Notify log
    setSysLog(prev => [
      `[Quét] Phát hiện ${dev.brand} ${dev.model} - Khung hình: ${dev.resolution}`,
      `[Bù sai lệch] Đã bù hao hụt tai thỏ (${dev.notchType}): X: ${dev.compensateX}px, Y: ${dev.compensateY}px`,
      ...prev.slice(0, 3)
    ]);

    onChangeConfig({
      ...config,
      offsetX: dev.compensateX,
      offsetY: dev.compensateY
    });
  };

  const handleDeviceChange = (dev: SimulatedDevice) => {
    setActiveDevice(dev);
    applyDeviceAutoCentering(dev);
  };

  // Screen Auto Detect real browser size
  const handleRealHardwareScan = () => {
    setIsAutoDetecting(true);
    setSysLog(prev => [`[Quét] Tiến hành quét cảm biến & tỷ lệ màn hình vật lý thực tế...`, ...prev]);

    setTimeout(() => {
      const screenWidth = window.screen.width * (window.devicePixelRatio || 1);
      const screenHeight = window.screen.height * (window.devicePixelRatio || 1);
      const isTouch = 'ontouchstart' in window;
      const ua = navigator.userAgent;
      
      let detectedBrand = 'Thiết bị của bạn';
      let detectedModel = 'Màn hình Trình duyệt';
      if (/Android/i.test(ua)) {
        detectedBrand = 'Android Phone';
        const match = ua.match(/Android\s+([^\s;]+)/);
        detectedModel = match ? `OS ${match[1]}` : 'Mobile device';
      } else if (/iPhone|iPad/i.test(ua)) {
        detectedBrand = 'Apple Device';
        detectedModel = /iPhone/i.test(ua) ? 'iPhone Screen' : 'iPad Screen';
      }

      const realDetected: SimulatedDevice = {
        id: 'real-detected',
        brand: detectedBrand,
        model: detectedModel,
        resolution: `${Math.round(screenWidth)} x ${Math.round(screenHeight)}`,
        notchType: isTouch ? 'center-drop' : 'none',
        notchSize: isTouch ? 40 : 0,
        compensateX: isTouch ? -12 : 0,
        compensateY: isTouch ? -12 : 0
      };

      setActiveDevice(realDetected);
      applyDeviceAutoCentering(realDetected);
      setIsAutoDetecting(false);
    }, 1000);
  };

  const handleFireClick = () => {
    if (isAutoFiring) return;
    setAnimState('firing');
    setTimeout(() => {
      setAnimState('idle');
    }, 120);
  };

  const handleAimClick = () => {
    if (isAutoFiring) return;
    setAnimState(prev => (prev === 'aiming' ? 'idle' : 'aiming'));
  };

  const resetOffset = () => {
    onChangeConfig({
      ...config,
      offsetX: 0,
      offsetY: 0
    });
    setSysLog(prev => [`[Reset] Đã chuyển về vị trí mặc định tuyệt đối (X: 0, Y: 0)`, ...prev]);
  };

  const adjustOffset = (dir: 'up' | 'down' | 'left' | 'right', amount = 1) => {
    let dx = 0;
    let dy = 0;
    if (dir === 'up') dy = -amount;
    if (dir === 'down') dy = amount;
    if (dir === 'left') dx = -amount;
    if (dir === 'right') dx = amount;

    const newX = config.offsetX + dx;
    const newY = config.offsetY + dy;

    onChangeConfig({
      ...config,
      offsetX: newX,
      offsetY: newY
    });

    setSysLog(prev => [`[Căn chỉnh] Thay đổi tọa độ thủ công: X: ${newX}, Y: ${newY}`, ...prev.slice(0, 3)]);
  };

  // Safe image render - use fallback CSS background graphics if Unsplash doesn't load
  const getStyleForBg = (): React.CSSProperties => {
    let resultStyles: React.CSSProperties = {};

    if (activeBg.id === 'custom' && customUrl) {
      resultStyles = { backgroundImage: `url(${customUrl})` };
    } else if (activeBg.type === 'ff') {
      resultStyles = {
        background: 'linear-gradient(rgba(10, 10, 20, 0.6), rgba(10, 10, 20, 0.4)), radial-gradient(circle at center, #c2410c 0%, #1e1b4b 70%)'
      };
    } else if (activeBg.type === 'pubg') {
      resultStyles = {
        background: 'linear-gradient(rgba(10, 10, 20, 0.5), rgba(10, 10, 20, 0.6)), radial-gradient(circle at center, #15803d 0%, #0f172a 75%)'
      };
    } else if (activeBg.type === 'codm') {
      resultStyles = {
        background: 'linear-gradient(rgba(10, 10, 20, 0.4), rgba(10, 10, 20, 0.5)), radial-gradient(circle at center, #1e3a8a 0%, #020617 75%)'
      };
    } else {
      resultStyles = {
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)'
      };
    }

    if (dạQuangBảnĐồ) {
      resultStyles.filter = 'contrast(1.45) brightness(1.2) saturate(1.7) sepia(0.2) hue-rotate(60deg)';
    }

    return resultStyles;
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col h-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-400" />
            Bảng Giả Lập & Nhận Diện Thiết Bị
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Hệ thống tự động phát hiện tỷ lệ khung vỏ, bù lệch camera để tâm không bao giờ bị lệch.
          </p>
        </div>
        
        {/* Mock UI Toggle */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Hiển thị:</label>
          <button
            onClick={() => setShowMockUi(!showMockUi)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              showMockUi 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {showMockUi ? 'Hiện HUD nút bấm' : 'Ẩn HUD nút bấm'}
          </button>
        </div>
      </div>

      {/* AUTO DETECTOR INTERFACE CONTROLLER */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3.5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-300 uppercase tracking-wider">Mô Phỏng Trực Tiếp Dòng Máy</div>
              <div className="text-[11px] text-slate-500 font-mono">Dựa trên cơ chế Auto-Calibration của dịch vụ Android</div>
            </div>
          </div>

          <button
            onClick={handleRealHardwareScan}
            disabled={isAutoDetecting}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 active:scale-95 disabled:opacity-50`}
          >
            <RefreshCw className={`h-3 w-3 ${isAutoDetecting ? 'animate-spin' : ''}`} />
            {isAutoDetecting ? 'Đang đo thực tế...' : 'Quét máy của bạn'}
          </button>
        </div>

        {/* Brand slider Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {SIMULATED_DEVICES.map((dev) => (
            <button
              key={dev.id}
              onClick={() => handleDeviceChange(dev)}
              className={`p-2 rounded-lg border text-left transition-all ${
                activeDevice.id === dev.id
                  ? 'border-emerald-500 bg-emerald-500/5 text-white'
                  : 'border-slate-850 bg-slate-900/40 text-slate-400 hover:border-slate-800'
              }`}
            >
              <div className="text-[10px] font-bold text-slate-500 uppercase">{dev.brand}</div>
              <div className="text-xs font-bold text-slate-300 truncate">{dev.model.split(' (')[0]}</div>
              <div className="text-[10px] text-emerald-400 font-mono mt-1">Bù: X: {dev.compensateX} | Y: {dev.compensateY}</div>
            </button>
          ))}
        </div>

        {/* Real-time Hardware Logger */}
        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850/60 font-mono text-[10px] text-slate-400 space-y-1">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <Cpu className="h-3 w-3 text-emerald-500" /> log nhận diện hệ thống (Auto-detected):
          </div>
          <div className="space-y-0.5">
            {sysLog.map((log, idx) => (
              <div key={idx} className={idx === 0 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simulator Frame (Simulated Mobile Screen with Simulated Cutouts) */}
      <div className="relative flex-1 min-h-[360px] md:min-h-[420px] rounded-xl overflow-hidden shadow-inner border-2 border-slate-700 flex items-center justify-center bg-slate-950">
        
        {/* Dynamic Notch Overlay simulator on top of battlefield screen */}
        {activeDevice.notchType !== 'none' && (
          <>
            {activeDevice.notchType === 'left-dot' && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full z-30 ring-4 ring-slate-900/55" title="Camera đục lỗ bên sườn" />
            )}
            {activeDevice.notchType === 'center-drop' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-4 bg-black rounded-b-xl z-30" title="Notch giọt nước" />
            )}
            {activeDevice.notchType === 'center-pill' && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-4 bg-black rounded-full z-30 ring-2 ring-slate-900/40" title="Dynamic Island" />
            )}
          </>
        )}

         {/* Live Game Background */}
        <div 
          style={getStyleForBg()} 
          className="absolute inset-0 bg-cover bg-center transition-all duration-300 flex items-center justify-center"
        >
          {/* Subtle Developer hidden watermark behind the app focus */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.06] overflow-hidden z-0">
            <span className="text-[48px] font-black tracking-[0.3em] uppercase select-none font-sans text-white transform -rotate-12">
              ĐÌNH QUANG
            </span>
          </div>

          {/* Simulated Enemies/Targets */}
          <div className="absolute top-[30%] left-[40%] text-center animate-bounce duration-1000 opacity-60">
            <div className="w-8 h-12 bg-red-600/30 border border-red-500/60 rounded-full flex items-center justify-center text-[10px] text-white font-mono">
              EnemY
            </div>
            <div className="text-[9px] text-red-400 font-mono mt-1">115m</div>
          </div>

          <div className="absolute top-[45%] left-[62%] text-center opacity-40">
            <div className="w-7 h-10 bg-red-600/20 border border-red-500/40 rounded-full flex items-center justify-center text-[10px] text-white font-mono">
              EnemY
            </div>
            <div className="text-[9px] text-red-400 font-mono mt-1">190m</div>
          </div>

          {/* Scope Ring simulation when aiming */}
          {animState === 'aiming' && (
            <div className="absolute inset-0 rounded-full border-[60px] md:border-[120px] border-black/85 flex items-center justify-center animate-fade-in pointer-events-none">
              <div className="w-full h-full border-4 border-slate-800/80 rounded-full flex items-center justify-center">
                <div className="w-[90%] h-[90%] border border-emerald-500/20 rounded-full" />
              </div>
            </div>
          )}

          {/* Custom overlays for different games to build realism */}
          {showMockUi && (
            <>
              {/* Game name & Health Bar HUD */}
              <div className="absolute top-4 left-6 pointer-events-none flex items-center gap-3">
                <div className="bg-black/40 backdrop-blur-sm self-start px-3 py-1 rounded border border-white/10 text-xs font-mono text-white tracking-widest uppercase">
                  {activeBg.type.toUpperCase()}_STAGE
                </div>
                {/* Health bar mockup */}
                <div className="flex flex-col gap-1">
                  <div className="text-[9px] text-slate-300 font-bold tracking-wider">Máu: 200/200</div>
                  <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-emerald-500 w-full" />
                  </div>
                </div>
              </div>

              {/* Ammo status HUD */}
              <div className="absolute bottom-4 right-6 pointer-events-none text-right">
                <div className="text-2xl font-bold font-mono text-white tracking-tight">30<span className="text-xs text-slate-400">/120</span></div>
                <div className="text-[10px] font-semibold text-amber-500 font-mono tracking-wider">CAR-98 SNIPER</div>
              </div>

              {/* Simulated Left Joystick */}
              <div className="absolute bottom-10 left-12 w-24 h-24 rounded-full border border-white/20 bg-black/20 backdrop-blur-[2px] flex items-center justify-center pointer-events-none blur-[0.3px]">
                <div className="w-10 h-10 rounded-full bg-white/30 border border-white/40 shadow-md transform -translate-x-1 -translate-y-2" />
              </div>

              {/* Simulated Fire Button (Right) */}
              <button
                onClick={handleFireClick}
                onTouchStart={handleFireClick}
                className="absolute right-12 bottom-12 w-16 h-16 rounded-full border-2 border-orange-500/50 bg-gradient-to-br from-orange-600/40 to-red-600/50 flex items-center justify-center shadow-lg hover:brightness-125 active:scale-95 transition-all text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-black/10">
                  <span className="text-[10px] font-black tracking-widest text-white">BẮN</span>
                </div>
              </button>

              {/* Scope/Aim button (Right high) */}
              <button
                onClick={handleAimClick}
                className={`absolute right-32 bottom-20 w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                  animState === 'aiming'
                    ? 'border-emerald-500 bg-emerald-600/40 text-white'
                    : 'border-white/20 bg-black/40 text-slate-300 hover:text-white'
                }`}
              >
                <Target className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Dynamic Crosshair Render Container */}
          {isCrosshairVisible && (
            <div 
              className="absolute z-10 transition-transform duration-75 pointer-events-none"
              style={{
                transform: `translate(${config.offsetX}px, ${config.offsetY + (autoGhìmTâm && animState === 'firing' ? mứcGiảmGiật * 0.32 : 0)}px)`,
                filter: animState === 'firing' ? 'drop-shadow(0 0 8px rgba(249,115,22,0.4))' : 'none'
              }}
            >
              <CrosshairRender config={config} animationState={animState} />
            </div>
          )}

          {/* PANEL KÈM PHÍM ĐIỀU HƯỚNG TRÊN GAME (EXPANDED PANEL) */}
          {isMenuOpen ? (
            <div 
              className="absolute z-50 bg-slate-950/98 backdrop-blur-md border border-emerald-500/40 p-3 rounded-2xl w-64 shadow-2xl shadow-black/95 animate-in fade-in zoom-in duration-100 text-center flex flex-col gap-2 font-sans select-none"
              style={{ left: `${widgetPos.x}px`, top: `${widgetPos.y}px` }}
            >
              {/* Header Draggable Bar */}
              <div 
                onMouseDown={onHeaderMouseDown}
                onTouchStart={onHeaderTouchStart}
                onTouchMove={onHeaderTouchMove}
                onTouchEnd={onHeaderTouchEnd}
                className="flex items-center justify-between border-b border-slate-900 pb-1.5 cursor-grab active:cursor-grabbing hover:bg-slate-900/30 p-1 rounded-lg select-none"
                title="Giữ kéo ở đây để di chuyển Menu tự do"
              >
                <div 
                  className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-300 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeakDev();
                  }}
                  title="Chạm để nghe danh tính nhà phát triển"
                >
                  <Move className="h-3 w-3 text-emerald-400" />
                  <span className="text-[10px] font-black tracking-widest text-emerald-400 flex items-center gap-1">
                    MENU HACK TÂM 
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  </span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    setSysLog(prev => ['[System] Thu nhỏ Menu thành bong bóng nổi.', ...prev.slice(0, 3)]);
                  }}
                  className="bg-emerald-950 hover:bg-emerald-900 text-emerald-400 hover:text-white text-[9px] font-black font-sans px-2 py-0.5 rounded border border-emerald-800 transition-colors cursor-pointer"
                >
                  ✕ ẨN
                </button>
              </div>

              {/* Scrollable Features Container - ALL FEATURES INTERNAL ARE SCROLLABLE & SWIPEABLE */}
              <div 
                className="max-h-[220px] overflow-y-auto overflow-x-hidden flex flex-col gap-2.5 pr-1 select-none emerald-scrollbar touch-pan-y text-left"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
              >
                {/* coordinates / alignment D-pad in menu */}
                <div className="flex flex-col items-center bg-slate-900/40 p-1.5 rounded-xl border border-slate-900 gap-1 mt-1">
                  <span className="text-[8.5px] font-extrabold text-slate-500 uppercase tracking-widest leading-none mb-0.5">Phím Căn Biên Trục</span>
                  <div className="flex gap-1.5 font-sans">
                    <button 
                      onClick={() => adjustOffset('up')}
                      className="px-2.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-750 rounded text-[9px] font-bold cursor-pointer"
                    >
                      Lên ▲
                    </button>
                    <button 
                      onClick={() => adjustOffset('down')}
                      className="px-2.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-750 rounded text-[9px] font-bold cursor-pointer"
                    >
                      Xuống ▼
                    </button>
                  </div>
                  <div className="flex gap-1 w-full justify-center font-sans">
                    <button 
                      onClick={() => adjustOffset('left')}
                      className="flex-1 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-750 rounded text-[9px] font-bold cursor-pointer"
                    >
                      ◀ Trái
                    </button>
                    <button 
                      onClick={resetOffset}
                      className="px-1.5 py-0.5 bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-900/40 rounded text-[8.5px] font-black cursor-pointer"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => adjustOffset('right')}
                      className="flex-1 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-750 rounded text-[9px] font-bold cursor-pointer"
                    >
                      Phải ▶
                    </button>
                  </div>
                </div>

                {/* feature switches & togglers block */}
                <div className="bg-slate-900/50 p-1.5 rounded-xl border border-slate-900 flex flex-col gap-1.5 text-left">
                  <span className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Chức Năng Ưu Việt</span>
                  
                  {/* Auto ghìm tâm và slider cường độ */}
                  <div className="space-y-1 bg-slate-950/60 p-1.5 rounded border border-slate-900">
                    <div className="flex items-center justify-between text-[9px]">
                      <span className="font-bold text-slate-300 flex items-center gap-1">
                        <Flame className={`h-3 w-3 ${autoGhìmTâm ? 'text-orange-500 animate-pulse' : 'text-slate-500'}`} />
                        Auto Ghìm Tâm Trợ Lực
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={autoGhìmTâm} 
                          onChange={(e) => {
                            setAutoGhìmTâm(e.target.checked);
                            setSysLog(prev => [`[Menu Nổi] Trợ lực ghìm tâm: ${e.target.checked ? 'BẬT (Khóa 0 giật)' : 'TẮT'}`, ...prev.slice(0, 3)]);
                          }} 
                          className="sr-only peer" 
                        />
                        <div className="w-7 h-4 bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-slate-950"></div>
                      </label>
                    </div>
                    {autoGhìmTâm && (
                      <div className="space-y-0.5 pt-0.5">
                        <div className="flex justify-between text-[8px] text-slate-400 font-mono">
                          <span>Lực tì tâm súng:</span>
                          <span className="text-emerald-400 font-bold">{mứcGiảmGiật}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="10" 
                          max="100" 
                          value={mứcGiảmGiật} 
                          onChange={(e) => setMứcGiảmGiật(Number(e.target.value))} 
                          className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Dạ quang bản đồ hồng ngoại */}
                  <div className="flex items-center justify-between text-[9px] bg-slate-950/60 p-1.5 rounded border border-slate-900">
                    <span className="font-bold text-slate-300 flex items-center gap-1">
                      <Eye className={`h-3 w-3 ${dạQuangBảnĐồ ? 'text-teal-400 animate-pulse' : 'text-slate-500'}`} />
                      Dạ Quang Hồng Ngoại
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={dạQuangBảnĐồ} 
                        onChange={(e) => {
                          setDạQuangBảnĐồ(e.target.checked);
                          setSysLog(prev => [`[Menu Nổi] Dạ quang hồng ngoại: ${e.target.checked ? 'KÍCH HOẠT ĐỊNH VỊ' : 'TẮT'}`, ...prev.slice(0, 3)]);
                        }} 
                        className="sr-only peer" 
                      />
                      <div className="w-7 h-4 bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-500 peer-checked:after:bg-slate-950"></div>
                    </label>
                  </div>

                  {/* Quét ép sung cảm ứng 240Hz */}
                  <div className="flex items-center justify-between text-[9px] bg-slate-950/60 p-1.5 rounded border border-slate-900">
                    <span className="font-bold text-slate-300 flex items-center gap-1">
                      <Zap className={`h-3 w-3 ${mượtCảmỨng ? 'text-cyan-400' : 'text-slate-500'}`} />
                      Ép Xung Touch 240Hz
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={mượtCảmỨng} 
                        onChange={(e) => {
                          setMượtCảmỨng(e.target.checked);
                          setSysLog(prev => [`[Menu Nổi] Ép xung touch 240Hz: ${e.target.checked ? 'TĂNG TỐC' : 'TẮT'}`, ...prev.slice(0, 3)]);
                        }} 
                        className="sr-only peer" 
                      />
                      <div className="w-7 h-4 bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-cyan-500 peer-checked:after:bg-slate-950"></div>
                    </label>
                  </div>

                  {/* Chống rung Gyro nháy tay */}
                  <div className="flex items-center justify-between text-[9px] bg-slate-950/60 p-1.5 rounded border border-slate-900">
                    <span className="font-bold text-slate-300 flex items-center gap-1">
                      <Shield className={`h-3 w-3 ${giảmRungLắc ? 'text-amber-400' : 'text-slate-500'}`} />
                      Ổn Định Giảm Rung
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={giảmRungLắc} 
                        onChange={(e) => {
                          setGiảmRungLắc(e.target.checked);
                          setSysLog(prev => [`[Menu Nổi] Khóa chống nhiễu Gyro: ${e.target.checked ? 'ĐANG KHÓA' : 'TẮT'}`, ...prev.slice(0, 3)]);
                        }} 
                        className="sr-only peer" 
                      />
                      <div className="w-7 h-4 bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500 peer-checked:after:bg-slate-950"></div>
                    </label>
                  </div>

                  {/* Độ trễ phản hồi chạm */}
                  <div className="flex items-center justify-between text-[8.5px] bg-slate-950/60 p-1.5 rounded border border-slate-900 overflow-hidden">
                    <span className="font-bold text-slate-400">Độ Trễ Touch:</span>
                    <select 
                      value={độTrễPhảnHồi}
                      onChange={(e) => {
                        setĐộTrễPhảnHồi(e.target.value);
                        setSysLog(prev => [`[Menu Nổi] Độ trễ phản hồi: Đã ưu tiên mức ${e.target.value}`, ...prev.slice(0, 3)]);
                      }}
                      className="bg-slate-900 border border-slate-850 text-[8px] text-emerald-400 px-1 py-0.5 rounded focus:outline-none cursor-pointer"
                    >
                      <option value="1ms">1ms (Cực tiểu)</option>
                      <option value="2ms">2ms (Cân bằng)</option>
                      <option value="4ms">4ms (Ổn định)</option>
                    </select>
                  </div>

                  {/* Giọng Đọc Trợ Lý */}
                  <div className="flex items-center justify-between text-[8.5px] bg-slate-950/60 p-1.5 rounded border border-slate-900 overflow-hidden">
                    <span className="font-bold text-slate-400 flex items-center gap-1">
                      <Volume2 className="h-3 w-3 text-amber-500 animate-pulse" />
                      Giọng trợ lý:
                    </span>
                    <select 
                      value={giongNoi}
                      onChange={(e) => {
                        const nextGiong = e.target.value as 'nam' | 'nu' | 'robot' | 'funny';
                        setGiongNoi(nextGiong);
                        setSysLog(prev => [`[Giọng Nói] Đổi sang giọng: ${nextGiong === 'nam' ? 'Nam' : nextGiong === 'nu' ? 'Nữ' : nextGiong === 'robot' ? 'Robot AI' : 'Hài hước'}`, ...prev.slice(0, 3)]);
                        // Quick delayed trigger to allow state update to complete
                        setTimeout(() => handleSpeakDev(nextGiong), 60);
                      }}
                      className="bg-slate-900 border border-slate-850 text-[8px] text-amber-400 px-1.5 py-0.5 rounded focus:outline-none cursor-pointer font-bold"
                    >
                      <option value="nu">🙋‍♀️ Nữ (Trầm ấm)</option>
                      <option value="nam">🙋‍♂️ Nam (Bản lĩnh)</option>
                      <option value="robot">🤖 Robot AI (Cực Đỉnh)</option>
                      <option value="funny">🤪 Hài Hước (Vui Nhộn)</option>
                    </select>
                  </div>

                  {/* Tối ưu hóa & Giải phóng phần cứng kết nối AI */}
                  <div className="flex flex-col bg-slate-950/60 p-1.5 rounded border border-slate-900 gap-1.5">
                    <div className="flex items-center justify-between text-[9px]">
                      <span className="font-bold text-slate-300 flex items-center gap-1">
                        <Cpu className={`h-3 w-3 ${isBoosting || isBoosted ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
                        Giải Phóng Phần Cứng
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={isBoosted || isBoosting} 
                          onChange={handleToggleHardwareBoost} 
                          className="sr-only peer" 
                        />
                        <div className="w-7 h-4 bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500 peer-checked:after:bg-slate-950"></div>
                      </label>
                    </div>

                    {isBoosting && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[7px] text-amber-400 font-mono leading-none">
                          <span>Đang dọn RAM & tối ưu hóa...</span>
                          <span>{boostProgress}%</span>
                        </div>
                        <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 transition-all duration-100" 
                            style={{ width: `${boostProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {isBoosted && (
                      <div className="text-[7.5px] text-emerald-400 font-bold leading-none bg-emerald-950/30 p-1.5 rounded border border-emerald-900/30">
                        ✓ ĐÃ GIẢI PHÓNG & GIẢM LAG CPU/GPU
                      </div>
                    )}
                  </div>
                </div>

                {/* regular styling / feature cycles bar */}
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => {
                      setIsCrosshairVisible(!isCrosshairVisible);
                      setSysLog(prev => [`[Bóng Nổi] Bật/Tắt tâm ảo: ${!isCrosshairVisible ? 'HIỆN' : 'ẨN'}`, ...prev.slice(0, 3)]);
                    }}
                    className={`py-1 rounded-md text-[8px] font-black border transition-all cursor-pointer ${
                      isCrosshairVisible 
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {isCrosshairVisible ? 'Ẩn Tâm' : 'Hiện Tâm'}
                  </button>

                  <button
                    onClick={handleCycleShape}
                    className="py-1 rounded-md text-[8px] font-black bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:brightness-110 active:scale-95 cursor-pointer"
                  >
                    Đổi Kiểu
                  </button>

                  <button
                    onClick={handleCycleColor}
                    className="py-1 rounded-md text-[8px] font-black bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:brightness-110 active:scale-95 cursor-pointer"
                  >
                    Đổi Màu
                  </button>
                </div>
              </div>

              <div className="text-[7.5px] font-mono text-slate-500 text-center leading-none select-none mt-0.5">
                Kéo tiêu đề bên trên để di chuyển tự do
              </div>
            </div>
          ) : (
            /* BONG BÓNG ĐIỀU KHIỂN NỔI GIẢ LẬP (FLOATING TRIGGER) */
            <div 
              className="absolute z-40 select-none cursor-grab active:cursor-grabbing text-base touch-none flex items-center justify-center w-11 h-11 rounded-full border border-emerald-500 bg-[#1e293b]/90 shadow-lg shadow-emerald-500/20 text-white hover:scale-105 active:scale-95 transition-all text-center"
              style={{ left: `${widgetPos.x}px`, top: `${widgetPos.y}px`, userSelect: 'none' }}
              onMouseDown={onMouseDown}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              title="Bóng điều khiển nổi - kéo thả di chuyển trên game, hoặc click nút để mở panel cài đặt nhanh"
            >
              🎯
            </div>
          )}
        </div>
      </div>

      {/* Simulator Control Board */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-6 pt-5 border-t border-slate-800">
        {/* Background Selector */}
        <div className="md:col-span-6 space-y-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Chọn Bản Đồ Giả Lập
          </label>
          <div className="grid grid-cols-3 gap-2">
            {DEFAULT_BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setActiveBg(bg)}
                className={`px-3 py-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
                  activeBg.id === bg.id
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                <div className="font-bold truncate">{bg.name.split(' - ')[0]}</div>
                <div className="text-[10px] text-slate-500 truncate">{bg.name.split(' - ')[1]}</div>
              </button>
            ))}
          </div>

          {/* Custom URL background */}
          <div className="flex gap-2 items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Hoặc dán ảnh:</span>
            <input
              type="text"
              placeholder="Dán link ảnh nền game tùy ý..."
              value={customUrl}
              onChange={(e) => {
                setCustomUrl(e.target.value);
                setActiveBg({ id: 'custom', name: 'Nền tự chọn', type: 'custom', imageUrl: e.target.value });
              }}
              className="flex-1 bg-slate-950/60 text-xs text-slate-300 px-3 py-1.5 rounded-md border border-slate-800 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Bảng Kích Hoạt & Khởi Chạy Game Thông Minh */}
          {['ff', 'pubg', 'codm'].includes(activeBg.type) && (
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 space-y-3 mt-2 shadow-lg transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none rounded-full blur-xl" />
              
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Play className="h-3 w-3 text-emerald-400 animate-pulse" />
                  Hỗ Trợ Kích Hoạt & Khởi Chạy
                </span>
                <span className="text-[7.5px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-black tracking-widest uppercase">
                  READY TO LINK
                </span>
              </div>

              {/* Step 1: Selection depending on active style */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                  Bước 1: Chọn Phiên Bản Thích Hợp
                </label>

                {activeBg.type === 'ff' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedFfVersion('ffth')}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                        selectedFfVersion === 'ffth'
                          ? 'bg-orange-500/15 border-orange-500/60 shadow-[0_0_8px_rgba(249,115,22,0.15)]'
                          : 'bg-slate-900/60 border-slate-850 opacity-60 hover:opacity-100 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm">🔥</span>
                      <span className="text-[9.5px] font-black text-orange-400 mt-1">FF Thường</span>
                      <span className="text-[7px] text-slate-500 font-mono">com.dts.freefireth</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedFfVersion('ffm')}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                        selectedFfVersion === 'ffm'
                          ? 'bg-amber-500/15 border-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.15)]'
                          : 'bg-slate-900/60 border-slate-850 opacity-60 hover:opacity-100 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm">⚡</span>
                      <span className="text-[9.5px] font-black text-amber-400 mt-1">Free Fire MAX</span>
                      <span className="text-[7px] text-slate-500 font-mono">com.dts.freefiremax</span>
                    </button>
                  </div>
                )}

                {activeBg.type === 'pubg' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPubgVersion('pubgvn')}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                        selectedPubgVersion === 'pubgvn'
                          ? 'bg-emerald-500/15 border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.15)]'
                          : 'bg-slate-900/60 border-slate-850 opacity-60 hover:opacity-100 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm">🇻🇳</span>
                      <span className="text-[9.5px] font-black text-emerald-400 mt-1">PUBG Mobile VN</span>
                      <span className="text-[7px] text-slate-500 font-mono">com.vng.pubgmobile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPubgVersion('pubgglobal')}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                        selectedPubgVersion === 'pubgglobal'
                          ? 'bg-blue-500/15 border-blue-500/60 shadow-[0_0_8px_rgba(59,130,246,0.15)]'
                          : 'bg-slate-900/60 border-slate-850 opacity-60 hover:opacity-100 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm">🌐</span>
                      <span className="text-[9.5px] font-black text-blue-400 mt-1">PUBG Global</span>
                      <span className="text-[7px] text-slate-500 font-mono">com.tencent.ig</span>
                    </button>
                  </div>
                )}

                {activeBg.type === 'codm' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCodmVersion('codmvn')}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                        selectedCodmVersion === 'codmvn'
                          ? 'bg-yellow-500/15 border-yellow-500/60 shadow-[0_0_8px_rgba(234,179,8,0.15)]'
                          : 'bg-slate-900/60 border-slate-850 opacity-60 hover:opacity-100 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm">🔥</span>
                      <span className="text-[9.5px] font-black text-yellow-400 mt-1">COD Mobile VN</span>
                      <span className="text-[7px] text-slate-500 font-mono">com.vng.codm</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedCodmVersion('codmglobal')}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                        selectedCodmVersion === 'codmglobal'
                          ? 'bg-cyan-500/15 border-cyan-500/60 shadow-[0_0_8px_rgba(6,182,212,0.15)]'
                          : 'bg-slate-900/60 border-slate-850 opacity-60 hover:opacity-100 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm">💀</span>
                      <span className="text-[9.5px] font-black text-cyan-400 mt-1">COD Garena</span>
                      <span className="text-[7px] text-slate-500 font-mono">com.garena.game.codm</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Step 2: Main Launch Button */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide flex justify-between select-none">
                  <span>Bước 2: Click để kích hoạt sâu & mở game</span>
                  <span className="text-slate-400 italic">Auto-Sync</span>
                </label>
                
                <button
                  type="button"
                  onClick={() => {
                    if (activeBg.type === 'ff') {
                      handleLaunchApp(selectedFfVersion);
                    } else if (activeBg.type === 'pubg') {
                      handleLaunchApp(selectedPubgVersion);
                    } else if (activeBg.type === 'codm') {
                      handleLaunchApp(selectedCodmVersion);
                    }
                  }}
                  className="w-full h-10 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 hover:brightness-110 text-white font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="h-4 w-4 text-white fill-white animate-pulse" />
                  BẤM VÀO GAME NGAY 🚀
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Alignment & Action Panel */}
        <div className="md:col-span-6 grid grid-cols-2 gap-4">
          
          {/* Action Simulation Controls */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Play className="h-3.5 w-3.5 text-orange-500" />
              Tác động Giả Lập
            </label>
            <div className="flex flex-col gap-2">
              <button
                onMouseDown={() => setAnimState('firing')}
                onMouseUp={() => setAnimState('idle')}
                onTouchStart={() => setAnimState('firing')}
                onTouchEnd={() => setAnimState('idle')}
                className="w-full bg-slate-800 border border-slate-700 hover:bg-slate-750 text-white active:scale-95 text-xs py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                Giữ chuột để Thử Bắn
              </button>

              <button
                onClick={() => setIsAutoFiring(!isAutoFiring)}
                className={`w-full text-xs py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  isAutoFiring
                    ? 'bg-amber-600 border border-amber-500 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                {isAutoFiring ? 'Tắt sấy đạn liên tục' : 'Bật Sấy Đạn Tự Động'}
              </button>
            </div>
          </div>

          {/* Coordinate Offset Calibration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Move className="h-3.5 w-3.5 text-blue-500" />
                Căn Chỉnh Tọa Độ
              </label>
              {(config.offsetX !== 0 || config.offsetY !== 0) && (
                <button 
                  onClick={resetOffset} 
                  className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-0.5"
                  title="Đặt lại về chính giữa"
                >
                  <RotateCcw className="h-2.5 w-2.5" /> Reset
                </button>
              )}
            </div>

            {/* D-Pad Alignment */}
            <div className="flex items-center justify-between bg-slate-950/40 p-1.5 rounded-lg border border-slate-800">
              <div className="grid grid-cols-3 gap-1 w-24 mx-auto">
                <div />
                <button
                  onClick={() => adjustOffset('up')}
                  className="w-7 h-7 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 rounded active:scale-90 flex items-center justify-center text-xs"
                >
                  ▲
                </button>
                <div />

                <button
                  onClick={() => adjustOffset('left')}
                  className="w-7 h-7 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 rounded active:scale-90 flex items-center justify-center text-xs"
                >
                  ◀
                </button>
                <div className="flex items-center justify-center text-[9px] font-mono font-bold text-slate-500">
                  {config.offsetX},{config.offsetY}
                </div>
                <button
                  onClick={() => adjustOffset('right')}
                  className="w-7 h-7 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 rounded active:scale-90 flex items-center justify-center text-xs"
                >
                  ▶
                </button>

                <div />
                <button
                  onClick={() => adjustOffset('down')}
                  className="w-7 h-7 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 rounded active:scale-90 flex items-center justify-center text-xs"
                >
                  ▼
                </button>
                <div />
              </div>

              {/* Fast adjust */}
              <div className="flex flex-col gap-1 pr-1.5 justify-center h-full">
                <span className="text-[9px] text-slate-500 font-bold text-center">Nhanh (±5px)</span>
                <div className="flex gap-1 justify-center">
                  <button 
                    onClick={() => adjustOffset('left', 5)}
                    className="px-1 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-[10px] rounded"
                  >
                    -5X
                  </button>
                  <button 
                    onClick={() => adjustOffset('right', 5)}
                    className="px-1 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-[10px] rounded"
                  >
                    +5X
                  </button>
                </div>
                <div className="flex gap-1 justify-center">
                  <button 
                    onClick={() => adjustOffset('up', 5)}
                    className="px-1 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-[10px] rounded"
                  >
                    -5Y
                  </button>
                  <button 
                    onClick={() => adjustOffset('down', 5)}
                    className="px-1 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-[10px] rounded"
                  >
                    +5Y
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
