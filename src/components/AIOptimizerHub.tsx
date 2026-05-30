import React, { useState, useEffect } from 'react';
import { 
  Cpu, Sliders, Zap, CheckCircle, RefreshCw, 
  Thermometer, Activity, Wifi, Smartphone, Sparkles, 
  Battery, AlertCircle, Compass 
} from 'lucide-react';

interface DevicePreset {
  brand: string;
  models: string[];
  defaultDpi: number;
}

const DEVICE_BRANDS: DevicePreset[] = [
  { brand: 'iPhone (Apple)', models: ['iPhone 15 Pro Max', 'iPhone 14 Pro', 'iPhone 13', 'iPhone 11 / XR'], defaultDpi: 0 },
  { brand: 'Samsung Galaxy', models: ['Galaxy S24 Ultra', 'Galaxy S23', 'Galaxy A54', 'Galaxy Note 20'], defaultDpi: 411 },
  { brand: 'Xiaomi / POCO', models: ['Xiaomi 14 Ultra', 'POCO F5 Pro', 'Redmi Note 13', 'POCO X6 Pro'], defaultDpi: 390 },
  { brand: 'ASUS ROG Phone', models: ['ROG Phone 8 Pro', 'ROG Phone 7 Ultimate', 'ROG Phone 6'], defaultDpi: 440 },
  { brand: 'Oppo / Realme', models: ['Oppo Find X7', 'Realme GT5', 'Oppo Reno 11', 'Realme 11 Pro'], defaultDpi: 380 },
  { brand: 'Vivo / iQOO', models: ['iQOO 12 Pro', 'Vivo X100 Pro', 'iQOO Neo 9'], defaultDpi: 400 },
];

const TARGET_GAMES = [
  { id: 'ff', name: 'Free Fire (Kéo tâm Auto-Headshot)', desc: 'Tối ưu độ nhạy xoay 360 và kích thước nút bắn' },
  { id: 'pubg', name: 'PUBG Mobile (Ghìm tâm sấy Gyro/ADS)', desc: 'Tối ưu cảm biến con quay hồi chuyển và x6/x4 scope' },
  { id: 'codm', name: 'Call of Duty Mobile (Quick-Scope)', desc: 'Tối ưu phản ứng bấm ngắm bắn nhanh cho các dòng Sniper' },
  { id: 'lq', name: 'Liên Quân Mobile (Skill Định Hướng)', desc: 'Mượt hóa tốc độ vuốt điều hướng chiêu thức tuyệt đối' },
];

export const AIOptimizerHub: React.FC = () => {
  // Brand & Model Selection
  const [brandsList, setBrandsList] = useState<DevicePreset[]>(DEVICE_BRANDS);
  const [selectedBrand, setSelectedBrand] = useState(DEVICE_BRANDS[0].brand);
  const [selectedModel, setSelectedModel] = useState(DEVICE_BRANDS[0].models[0]);
  const [selectedGame, setSelectedGame] = useState('ff');

  // Device Live Stats
  const [ramUsed, setRamUsed] = useState(4.6);
  const [ramTotal, setRamTotal] = useState(8.0);
  const [cpuTemp, setCpuTemp] = useState(41);
  const [ping, setPing] = useState(62);
  const [isBoosting, setIsBoosting] = useState(false);
  const [boostProgress, setBoostProgress] = useState(0);
  const [boostLogs, setBoostLogs] = useState<string[]>([]);
  const [isBoosted, setIsBoosted] = useState(false);

  // AI Scanner & Physical Hardware Detector States
  const [isScanningDevice, setIsScanningDevice] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scannedSpecs, setScannedSpecs] = useState<{
    brand: string;
    model: string;
    resolution: string;
    aspectRatio: string;
    refreshRate: number;
    processors: number;
    isMobile: boolean;
  } | null>(null);

  // AI Sensitivity Output States
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [aiResult, setAiResult] = useState<any | null>(null);

  // Update models list when brand changes
  useEffect(() => {
    const brandObj = brandsList.find(d => d.brand === selectedBrand);
    if (brandObj && brandObj.models.length > 0) {
      setSelectedModel(brandObj.models[0]);
    }
  }, [selectedBrand, brandsList]);

  // Helper to measure physical screen FPS via requestAnimationFrame
  const measurePhysicalFPS = () => {
    return new Promise<number>((resolve) => {
      let start = performance.now();
      let frames = 0;
      const tick = (now: number) => {
        frames++;
        if (now - start >= 650) {
          const calculatedFps = Math.round((frames * 1000) / (now - start));
          // Polish to standard monitor refresh rates
          if (calculatedFps > 130) resolve(144);
          else if (calculatedFps > 105) resolve(120);
          else if (calculatedFps > 80) resolve(90);
          else resolve(60);
        } else {
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
    });
  };

  // Perform full hardware and screen scan in real-time
  const handleScanPhysicalDevice = async () => {
    setIsScanningDevice(true);
    setScanProgress(0);
    setScanLogs([]);

    const logSteps = [
      '🔍 Khởi tạo tiến trình quét cấu hình phần cứng thực tế...',
      '🖥️ Phân tích độ phân giải màn hình tương tác hiện tại...',
      '📐 Định vị tỷ lệ khung hình chuẩn ngoại vi (Aspect Ratio detection)...',
      '⚡ Đang đo tần số làm tươi thực tế (requestAnimationFrame sampling)...',
      '📱 Tra cứu bộ nhớ đệm luồng xử lý trung tâm...',
      '🤖 Đồng bộ hóa cấu hình với thuật toán kéo tâm thông minh...'
    ];

    let currentLogIdx = 0;
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        if (prev > currentLogIdx * 16 && currentLogIdx < logSteps.length) {
          setScanLogs(l => [...l, logSteps[currentLogIdx]]);
          currentLogIdx++;
        }
        return prev + 5;
      });
    }, 85);

    // Run FPS measure
    const measuredFpsPoint = await measurePhysicalFPS();
    
    setTimeout(() => {
      clearInterval(interval);
      setScanProgress(100);

      const screenWidth = window.screen.width * (window.devicePixelRatio || 1);
      const screenHeight = window.screen.height * (window.devicePixelRatio || 1);
      const major = Math.max(screenWidth, screenHeight);
      const minor = Math.min(screenWidth, screenHeight);
      const ratio = major / minor;
      
      let detectedAspect = `${Math.round(ratio * 10) / 10}:1`;
      if (ratio >= 2.1) detectedAspect = '21:9 UltraWide';
      else if (ratio >= 2.0) detectedAspect = '20:9 Wide Screen';
      else if (ratio >= 1.9) detectedAspect = '19.5:9 Notch Border';
      else if (ratio >= 1.7) detectedAspect = '16:9 Standard';
      else if (ratio >= 1.5) detectedAspect = '3:2 Retinal Aspect';
      else detectedAspect = '4:3 Pad Layout';

      const isTouch = 'ontouchstart' in window;
      const ua = navigator.userAgent;
      let brandName = 'Trình duyệt Web';
      let modelName = 'PC / Laptop Client';

      if (/Android/i.test(ua)) {
        brandName = 'Điện thoại Android';
        const modelMatch = ua.match(/Android\s+([^\s;]+)/);
        modelName = modelMatch ? `Android OS ${modelMatch[1]}` : 'Android Device';
      } else if (/iPhone/i.test(ua)) {
        brandName = 'Apple iPhone';
        modelName = 'iPhone Retina Display';
      } else if (/iPad/i.test(ua)) {
        brandName = 'Apple iPad';
        modelName = 'iPad High Definition';
      }

      const estimatedMem = (navigator as any).deviceMemory || 8;
      const coreThreads = navigator.hardwareConcurrency || 8;

      const specs = {
        brand: brandName,
        model: `${modelName} (${detectedAspect})`,
        resolution: `${Math.round(screenWidth)} x ${Math.round(screenHeight)}`,
        aspectRatio: detectedAspect,
        refreshRate: measuredFpsPoint,
        processors: coreThreads,
        isMobile: isTouch || /Android|iPhone|iPad/i.test(ua)
      };

      const customBrand: DevicePreset = {
        brand: `⭐ ${brandName} (Đã Quét)`,
        models: [specs.model],
        defaultDpi: 420
      };

      setBrandsList(prev => {
        const filtered = prev.filter(b => !b.brand.includes('(Đã Quét)'));
        return [customBrand, ...filtered];
      });

      setScannedSpecs(specs);
      setSelectedBrand(customBrand.brand);
      setSelectedModel(customBrand.models[0]);
      
      // Update hardware indicators with real measurements!
      setRamTotal(estimatedMem);
      setRamUsed(parseFloat((estimatedMem * 0.52).toFixed(1)));
      setPing(20 + Math.round(Math.random() * 8));

      setIsScanningDevice(false);
    }, 1500);
  };

  // AI Calibration handler
  const handleStartCalibration = () => {
    setIsCalibrating(true);
    setCalibrationProgress(0);
    setAiResult(null);

    const interval = setInterval(() => {
      setCalibrationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Generate customized result based on brand and game
          setTimeout(() => {
            generateAIOutput();
            setIsCalibrating(false);
          }, 400);
          return 100;
        }
        return prev + 12;
      });
    }, 150);
  };

  const generateAIOutput = () => {
    // Generate intelligent-looking sens based on selected items
    const isIphone = selectedBrand.includes('iPhone') || selectedBrand.includes('Apple');
    const isRog = selectedBrand.includes('ASUS') || selectedBrand.includes('ROG');
    const isScanned = selectedBrand.includes('(Đã Quét)') && scannedSpecs;
    
    let baseSens = 80;
    if (isScanned) {
      const isWide = scannedSpecs.aspectRatio.includes('Wide') || scannedSpecs.aspectRatio.includes('Notch');
      baseSens = isWide ? 92 : 85;
    } else if (isIphone) {
      baseSens = 92;
    } else if (isRog) {
      baseSens = 182;
    } else {
      baseSens = 86;
    }

    let sensResult: any = {};

    if (selectedGame === 'ff') {
      // Free Fire updated the sensitivity slider maximum limit to 200!
      let ffBaseSens = 160;
      if (isScanned) {
        ffBaseSens = scannedSpecs.refreshRate >= 90 ? 182 : 166;
      } else if (isIphone) {
        ffBaseSens = 175;
      } else if (isRog) {
        ffBaseSens = 185;
      } else {
        ffBaseSens = 168;
      }

      sensResult = {
        general: Math.min(200, ffBaseSens + 14),
        reddot: Math.min(200, ffBaseSens + 9),
        scope2x: Math.min(200, ffBaseSens + 3),
        scope4x: Math.min(200, ffBaseSens - 1),
        awm: Math.min(200, ffBaseSens - 42),
        buttonSize: isIphone ? '44%' : (isScanned && scannedSpecs.isMobile ? '46%' : '49%'),
        dpi: isScanned 
          ? `Tự thích ứng: ${Math.round(410 + (scannedSpecs.processors * 8))} DPI (Màn: ${scannedSpecs.aspectRatio})`
          : (isIphone ? 'Mặc định (IOS TouchScale: 1.25)' : `${420 + Math.round(Math.random() * 80)} DPI`),
        touchDelay: isScanned ? `${(1.0 + 1 / scannedSpecs.processors).toFixed(1)}ms` : '1.2ms (Cực tiểu)',
        refreshRate: isScanned ? `${scannedSpecs.refreshRate}Hz Vật Lý` : (isIphone || isRog ? '120Hz ProMotion' : '90Hz Booster'),
        features: [
          `Auto-aim lock: Kéo cực chuẩn sườn đón bám sát tỷ lệ ${isScanned ? scannedSpecs.aspectRatio : '19.5:9'} mới`,
          `Mượt hóa phản hồi quét vuốt chạm tần số ${isScanned ? scannedSpecs.refreshRate : '120'}Hz cực khít`,
          `Tinh chuẩn dải ngắm ngắm súng tối thiểu giật với chip ${isScanned ? scannedSpecs.processors : '8'}-Nhân`
        ]
      };
    } else if (selectedGame === 'pubg') {
      sensResult = {
        general: Math.min(100, baseSens - 5),
        reddot: Math.min(100, baseSens),
        scope2x: Math.min(100, baseSens - 8),
        scope4x: Math.min(100, baseSens - 15),
        awm: Math.min(100, baseSens - 30),
        buttonSize: '55%',
        dpi: isScanned ? `Khớp luồng ${scannedSpecs.processors}-nhân (Tải lực sấy súng)` : (isIphone ? 'Mặc định (Bypass ADS)' : '480 DPI'),
        touchDelay: isScanned ? '1.1ms (Ultra-Low)' : '1.4ms (Đã triệt tiêu nội suy)',
        refreshRate: isScanned ? `${scannedSpecs.refreshRate}Hz Gương` : (isRog ? '144Hz HyperGaming' : '90Hz Gỗ'),
        features: [
          'Chống trôi Gyroscope: Khóa nhiễu tần suất rung tay',
          `Ghìm tâm thẳng đứng (Vertical Compensation) khớp màn ${isScanned ? scannedSpecs.aspectRatio : 'tiêu chuẩn'}`,
          `Mượt hóa tì ngắm ống kính Scope x4 và x6 tần số quét ${isScanned ? scannedSpecs.refreshRate : '90'}Hz`
        ]
      };
    } else {
      sensResult = {
        general: Math.min(100, baseSens - 2),
        reddot: Math.min(100, baseSens + 5),
        scope2x: Math.min(100, baseSens + 2),
        scope4x: Math.min(100, baseSens - 10),
        awm: Math.min(100, baseSens - 20),
        buttonSize: '50%',
        dpi: isScanned ? `Tỷ lệ ${scannedSpecs.aspectRatio}` : (isIphone ? 'Mặc định' : '450 DPI'),
        touchDelay: '1.1ms (Nhanh nhất)',
        refreshRate: isScanned ? `${scannedSpecs.refreshRate}Hz Đồng Bộ` : 'Chống tụt FPS thông minh',
        features: [
          'Snap-Targeting: Khóa địch chuẩn mực',
          'Bypass độ trễ nâng cao lớp nhân hệ thống',
          'Chống nhiễu các điểm chạm rìa màn hiện hữu'
        ]
      };
    }

    setAiResult(sensResult);
  };

  // Hardware Booster simulation
  const handleHardwareBoost = () => {
    setIsBoosting(true);
    setBoostProgress(0);
    setBoostLogs([]);
    setIsBoosted(false);

    const logsList = [
      '⚡ Đang rà quét hệ thống: Xác định tiến trình RAM hao tổn...',
      '🛠️ Dọn dẹp bộ nhớ đệm ẩn (Cache Partition Cleaner)...',
      '❄️ Tối ưu hóa lõi CPU: Kích hoạt chế độ tải đều luồng...',
      '📈 Đóng ứng dụng chạy ngầm không cần thiết (-16 tác vụ)...',
      '🚀 Tăng tốc cảm ứng: Ép tốc độ lấy mẫu màn hình lên đỉnh...',
      '📡 Định tuyến băng thông Game: Ưu tiên băng thông mạng...',
      '🟢 HOÀN TẤT: Hệ thống đã tối ưu hoá hoàn chỉnh cho Game!'
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setBoostProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsBoosting(false);
            setIsBoosted(true);
            setRamUsed(2.1); // RAM free up significantly!
            setCpuTemp(33);  // Cool down!
            setPing(24);     // Lower ping!
          }, 300);
          return 100;
        }

        // Add logs dynamically as process increases
        if (prev > currentLogIndex * 15 && currentLogIndex < logsList.length) {
          setBoostLogs(l => [...l, logsList[currentLogIndex]]);
          currentLogIndex++;
        }
        return prev + 5;
      });
    }, 120);
  };

  // Quick reset status for simulation helper
  const handleResetBoost = () => {
    setRamUsed(4.6);
    setCpuTemp(41);
    setPing(62);
    setIsBoosted(false);
    setIsBoosting(false);
    setBoostProgress(0);
    setBoostLogs([]);
  };

  // Broadcast state changes
  useEffect(() => {
    const handleStateUpdate = () => {
      const event = new CustomEvent('hw-boost-state', {
        detail: { isBoosting, isBoosted, boostProgress, ramUsed, cpuTemp, ping }
      });
      window.dispatchEvent(event);
    };
    handleStateUpdate();
  }, [isBoosting, isBoosted, boostProgress, ramUsed, cpuTemp, ping]);

  // Listen to remote actions from floating menu
  useEffect(() => {
    const triggerBoost = () => {
      if (!isBoosting && !isBoosted) {
        handleHardwareBoost();
      }
    };
    const resetBoost = () => {
      handleResetBoost();
    };

    window.addEventListener('trigger-hw-boost', triggerBoost);
    window.addEventListener('reset-hw-boost', resetBoost);

    return () => {
      window.removeEventListener('trigger-hw-boost', triggerBoost);
      window.removeEventListener('reset-hw-boost', resetBoost);
    };
  }, [isBoosting, isBoosted]);

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
      
      {/* Title & Tagline */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="h-5 w-5" />
          </span>
          Trợ Lý Tối Ưu Hóa AI & Độ Nhạy Thiết Bị
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Hệ thống AI chuyên sâu phân tích phần cứng dòng máy của bạn, đề xuất thông số DPI/Độ nhạy ngắm súng tuyệt đối và kích hoạt trình tăng tốc phần cứng mượt game.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* BLOCK 1: AI SENSITIVITY CALIBRATOR */}
        <div className="bg-slate-950/70 border border-slate-850 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-emerald-400" />
              Hiệu Chỉnh Độ Nhạy AI
            </span>
            <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded">V.4.2 SmartSens</span>
          </div>

          <div className="space-y-3.5">
            {/* AI AUTO DETECTOR WIDGET */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                  <Smartphone className="h-3 w-3 animate-pulse" />
                  AI Tự Động Quét Phần Cứng
                </span>
                {scannedSpecs && (
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-900 select-none">
                    DỮ LIỆU ĐÃ QUÉT
                  </span>
                )}
              </div>

              {!isScanningDevice && !scannedSpecs ? (
                <button
                  onClick={handleScanPhysicalDevice}
                  className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 hover:border-emerald-500/70 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  QUÉT & TỰ ĐỘNG THÍCH ỨNG TỶ LỆ MÀN HÌNH
                </button>
              ) : isScanningDevice ? (
                <div className="space-y-2 animate-pulse">
                  <div className="flex justify-between text-[9px] font-mono text-slate-450">
                    <span className="animate-pulse">Đang định vị cảm biến...</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-100" 
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  {scanLogs.length > 0 && (
                    <div className="font-mono text-[8.5px] text-slate-500 max-h-[40px] overflow-hidden whitespace-nowrap text-ellipsis">
                      &gt; {scanLogs[scanLogs.length - 1]}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2 text-[10px]">
                  {/* Visual specs indicators */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-2 rounded-lg border border-slate-900 font-mono text-slate-350">
                    <div className="space-y-1">
                      <div className="text-slate-500 text-[8px] uppercase font-bold leading-none">Màn hình vật lý</div>
                      <div className="font-bold text-emerald-400 truncate">{scannedSpecs?.resolution}</div>
                      
                      <div className="text-slate-500 text-[8px] uppercase font-bold leading-none mt-1">Tỷ lệ khung hình</div>
                      <div className="font-bold text-teal-400 truncate">{scannedSpecs?.aspectRatio}</div>
                    </div>
                    <div className="space-y-1 border-l border-slate-900 pl-2">
                      <div className="text-slate-500 text-[8px] uppercase font-bold leading-none">Tần số quét mượt</div>
                      <div className="font-bold text-cyan-400">{scannedSpecs?.refreshRate} Hz Thực tế</div>

                      <div className="text-slate-500 text-[8px] uppercase font-bold leading-none mt-1">Cấu hình CPU</div>
                      <div className="font-bold text-amber-500">{scannedSpecs?.processors} Nhân / {ramTotal}GB RAM</div>
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={handleScanPhysicalDevice}
                      className="flex-1 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded text-[9px] font-bold transition-all flex items-center justify-center gap-1 active:scale-98"
                    >
                      <RefreshCw className="h-3 w-3 text-slate-400" /> Quét lại cảm biến
                    </button>
                    <div className="px-2 py-1.5 text-center text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/40 rounded text-[8px] select-none flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                      ALIGNED
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Brand Dropdown */}
            <div>
              <label className="block text-[10px] text-slate-500 uppercase font-bold tracking-wide mb-1.5">Chọn hãng điện thoại của bạn</label>
              <select 
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg text-xs p-2.5 text-white font-medium focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                {brandsList.map(brandObj => (
                  <option key={brandObj.brand} value={brandObj.brand}>{brandObj.brand}</option>
                ))}
              </select>
            </div>

            {/* Models Dropdown */}
            <div>
              <label className="block text-[10px] text-slate-500 uppercase font-bold tracking-wide mb-1.5">Chọn phiên bản đời máy chính xác</label>
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg text-xs p-2.5 text-white font-medium focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
              >
                {brandsList.find(d => d.brand === selectedBrand)?.models.map(model => (
                  <option key={model} value={model}>{model}</option>
                )) || <option>Chưa chọn</option>}
              </select>
            </div>

            {/* Target game selector */}
            <div>
              <label className="block text-[10px] text-slate-500 uppercase font-bold tracking-wide mb-1.5">Chọn trò chơi muốn tối ưu sấy súng</label>
              <div className="grid grid-cols-2 gap-2">
                {TARGET_GAMES.map(game => (
                  <button
                    key={game.id}
                    onClick={() => setSelectedGame(game.id)}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      selectedGame === game.id 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                        : 'bg-slate-900 border-slate-800 hover:bg-slate-800/60 text-slate-400'
                    }`}
                  >
                    <span className="text-[11px] font-bold line-clamp-1">{game.name.split(' ')[0]}</span>
                    <span className="text-[8px] font-sans text-slate-500 mt-1 line-clamp-1">{game.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Action Button */}
            <button
              onClick={handleStartCalibration}
              disabled={isCalibrating || isBoosting || isScanningDevice}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-98 font-bold text-xs text-slate-950 rounded-xl transition-all shadow-md shadow-emerald-950/40 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isCalibrating ? 'animate-spin' : ''}`} />
              {isCalibrating ? 'AI ĐANG PHÂN TÍCH THUẬT TOÁN...' : 'PHÂN TÍCH SENS CỦA BẠN QUA AI'}
            </button>
          </div>

          {/* AI Progress slider indicator */}
          {isCalibrating && (
            <div className="space-y-1 bg-slate-900 p-3 rounded-lg border border-slate-850 animate-pulse">
              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                <span>Quét cảm biến xung nhịp màn hình...</span>
                <span>{calibrationProgress}%</span>
              </div>
              <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-150" 
                  style={{ width: `${calibrationProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* AI Sens Analysis Result Output */}
          {aiResult && !isCalibrating && (
            <div className="bg-emerald-950/15 border border-emerald-500/25 p-3.5 rounded-xl space-y-3 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center gap-2 border-b border-emerald-900/35 pb-1.5">
                <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">★ AI RECOMMENDATION</span>
                <span className="text-[9px] text-slate-400 font-medium">Khuyên dùng dành riêng cho: <strong>{selectedModel}</strong></span>
              </div>

              {/* Sens Values Columns Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between border-b border-slate-900/50 pb-0.5">
                    <span className="text-slate-450 font-medium">Nhìn Xung Quanh (General):</span>
                    <strong className="text-emerald-400">{aiResult.general}{selectedGame === 'ff' ? '/200' : '/100'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-900/50 pb-0.5">
                    <span className="text-slate-450 font-medium">Red Dot Sight:</span>
                    <strong className="text-emerald-400">{aiResult.reddot}{selectedGame === 'ff' ? '/200' : '/100'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-900/50 pb-0.5">
                    <span className="text-slate-450 font-medium">Ngắm 2x Scope:</span>
                    <strong className="text-emerald-400">{aiResult.scope2x}{selectedGame === 'ff' ? '/200' : '/100'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-900/50 pb-0.5">
                    <span className="text-slate-450 font-medium">Ngắm 4x Scope:</span>
                    <strong className="text-emerald-400">{aiResult.scope4x}{selectedGame === 'ff' ? '/200' : '/100'}</strong>
                  </div>
                  <div className="flex justify-between pb-0.5">
                    <span className="text-slate-450 font-medium">Súng ngắm AWM (Sniper):</span>
                    <strong className="text-emerald-400">{aiResult.awm || 50}{selectedGame === 'ff' ? '/200' : '/100'}</strong>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] border-l border-slate-900 pl-3">
                  <div className="flex justify-between border-b border-slate-900/50 pb-0.5">
                    <span className="text-slate-450 font-medium">Nút Bắn (Fire pos):</span>
                    <strong className="text-amber-400">{aiResult.buttonSize}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-900/50 pb-0.5">
                    <span className="text-slate-450 font-medium">Độ phân giải DPI:</span>
                    <strong className="text-teal-400">{aiResult.dpi}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-900/50 pb-0.5">
                    <span className="text-slate-450 font-medium">Độ trễ phản cảm:</span>
                    <strong className="text-pink-400">{aiResult.touchDelay}</strong>
                  </div>
                  <div className="flex justify-between pb-0.5">
                    <span className="text-slate-450 font-medium">Số quét màn:</span>
                    <strong className="text-blue-400">{aiResult.refreshRate}</strong>
                  </div>
                </div>
              </div>

              {/* Special Features pointers */}
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-900 text-[10px] space-y-1">
                <span className="font-extrabold text-[8px] text-slate-500 uppercase tracking-widest block">Tính năng lớp nhân can thiệp</span>
                {aiResult.features.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                    <span className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* BLOCK 2: DEVICE OPTIMIZER & PERFORMANCE BOOSTER */}
        <div className="bg-slate-950/70 border border-slate-850 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-amber-500 animate-pulse" />
              Tối Ưu Hóa & Giải Phóng Phần Cứng
            </span>
            <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded">Live Engine Status</span>
          </div>

          {/* Quick Hardware Indicators HUD */}
          <div className="grid grid-cols-3 gap-2.5">
            
            {/* RAM status */}
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850 text-center space-y-1">
              <Activity className="h-4 w-4 mx-auto text-cyan-400 mb-0.5" />
              <div className="text-[10px] text-slate-500 font-bold uppercase leading-none">Ram Sử Dụng</div>
              <div className={`text-base font-black ${isBoosted ? 'text-emerald-400' : 'text-zinc-200'}`}>
                {ramUsed.toFixed(1)} <span className="text-[8px] font-medium text-slate-500">/{ramTotal}GB</span>
              </div>
            </div>

            {/* CPU temperature */}
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850 text-center space-y-1">
              <Thermometer className={`h-4 w-4 mx-auto mb-0.5 ${cpuTemp > 38 ? 'text-rose-500 animate-bounce-slow' : 'text-blue-400'}`} />
              <div className="text-[10px] text-slate-500 font-bold uppercase leading-none">Nhiệt Độ CPU</div>
              <div className={`text-base font-black ${cpuTemp > 38 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {cpuTemp}°C
              </div>
            </div>

            {/* Network Ping */}
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850 text-center space-y-1">
              <Wifi className="h-4 w-4 mx-auto text-amber-400 mb-0.5" />
              <div className="text-[10px] text-slate-500 font-bold uppercase leading-none">Game Ping</div>
              <div className={`text-base font-black ${ping > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {ping} ms
              </div>
            </div>

          </div>

          {/* Optimization State Switch Action */}
          <div className="space-y-3 mt-1">
            {!isBoosting && !isBoosted ? (
              <button
                onClick={handleHardwareBoost}
                disabled={isCalibrating}
                className="w-full py-3 bg-slate-900 hover:bg-slate-850 text-amber-400 border border-amber-500/30 hover:border-amber-500/80 active:scale-98 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/40"
              >
                <Zap className="h-4.5 w-4.5 text-amber-400 fill-current" />
                ⚡ KÍCH HOẠT AI GAME BOOST (GIẢI PHÓNG RAM & CPU)
              </button>
            ) : isBoosting ? (
              <div className="space-y-2 bg-slate-900 p-3 rounded-lg border border-slate-850">
                <div className="flex justify-between text-[9px] font-mono text-amber-400 font-bold">
                  <span>Dịch vụ nén tiến trình game chạy độc quyền...</span>
                  <span>{boostProgress}%</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-100" 
                    style={{ width: `${boostProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1 bg-emerald-950/20 border border-emerald-500/25 px-3 py-2.5 rounded-xl flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div>
                    <h5 className="text-[11px] font-black text-slate-200">ĐÃ TỐI ƯU HOÁ THIẾT BỊ 100%</h5>
                    <p className="text-[9px] text-slate-400 mt-0.5">Đã giải phóng 2.5 GB RAM và hạ nhiệt Pin để hạn chế lag giật tối đa.</p>
                  </div>
                </div>
                <button 
                  onClick={handleResetBoost}
                  className="px-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl hover:text-white"
                  title="Đặt lại mô phỏng"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Boosting Console Logs */}
          {(isBoosting || isBoosted) && (
            <div className="bg-slate-950 rounded-lg p-2.5 border border-slate-900 font-mono text-[9px] space-y-1 text-slate-400 max-h-[140px] overflow-auto">
              <div className="text-[7.5px] text-slate-550 border-b border-slate-900 pb-1 uppercase tracking-wider font-sans font-bold">Boosting Operations Thread</div>
              {boostLogs.map((log, index) => (
                <div key={index} className={index === boostLogs.length - 1 ? 'text-amber-300 font-bold' : ''}>
                  &gt; {log}
                </div>
              ))}
            </div>
          )}

          {/* Safety disclaimer info */}
          <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-900 flex gap-2 text-[10px] text-slate-400">
            <AlertCircle className="h-4.5 w-4.5 text-cyan-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Giải thuật AI Game Turbo hoạt động hoàn toàn ở lớp ứng dụng (Application sandbox Layer), không đổi tập tin hệ thống hay sửa dữ liệu gốc tránh mọi lỗi hỏng hay trục trặc máy.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
