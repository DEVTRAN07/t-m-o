import { CrosshairConfig } from './types';

export function getAideTemplates(config: CrosshairConfig): { name: string; path: string; language: 'java' | 'xml'; content: string; description: string }[] {
  const hexToAndroidColor = (hex: string) => {
    // hex is e.g. "#ff0000" or "#00ff00"
    // convert to android color value e.g. 0xFFFF0000 (Color.argb/Color.rgb)
    const normalized = hex.replace('#', '');
    if (normalized.length === 6) {
      return `0xFF${normalized.toUpperCase()}`;
    }
    return `0xFF${normalized.toUpperCase()}`;
  };

  const hasOutlineVal = config.hasOutline ? 'true' : 'false';
  const hasDotVal = config.hasDot ? 'true' : 'false';
  const colorVal = hexToAndroidColor(config.color);
  const dotColorVal = hexToAndroidColor(config.dotColor);
  const outlineColorVal = hexToAndroidColor(config.outlineColor);

  return [
    {
      name: 'AndroidManifest.xml',
      path: 'app/src/main/AndroidManifest.xml',
      language: 'xml',
      description: 'File cấu hình ứng dụng, khai báo quyền vẽ đè màn hình (System Overlay permission) bắt buộc cho tâm ảo.',
      content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.aide.customcrosshair">

    <!-- QUYỀN VẼ LÊN TRÊN CÁC ỨNG DỤNG KHÁC (BẮT BUỘC) -->
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Tâm Ảo Game Mobile"
        android:theme="@style/AppTheme">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/AppTheme">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- DỊCH VỤ CHẠY NGẦM HIỂN THỊ TÂM ẢO -->
        <service
            android:name=".CrosshairService"
            android:enabled="true"
            android:exported="false" />
            
    </application>
</manifest>`
    },
    {
      name: 'MainActivity.java',
      path: 'app/src/main/java/com/aide/customcrosshair/MainActivity.java',
      language: 'java',
      description: 'Activity chính cung cấp giao diện bật/tắt tâm ảo và yêu cầu quyền SYSTEM_ALERT_WINDOW.',
      content: `package com.aide.customcrosshair;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

public class MainActivity extends Activity {
    private static final int OVERLAY_PERMISSION_REQ_CODE = 1234;
    private Button btnToggle;
    private boolean isServiceRunning = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        btnToggle = findViewById(R.id.btn_toggle);

        btnToggle.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (checkOverlayPermission()) {
                    toggleCrosshairService();
                } else {
                    requestOverlayPermission();
                }
            }
        });
    }

    private boolean checkOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return Settings.canDrawOverlays(this);
        }
        return true;
    }

    private void requestOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + getPackageName()));
            startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE);
            Toast.makeText(this, "Hãy cấp quyền Vẽ lên trên ứng dụng khác để kích hoạt Tâm Ảo!", Toast.LENGTH_LONG).show();
        }
    }

    private void toggleCrosshairService() {
        Intent intent = new Intent(this, CrosshairService.class);
        if (!isServiceRunning) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(intent);
            } else {
                startService(intent);
            }
            btnToggle.setText("TẮT TÂM ẢO");
            btnToggle.setBackgroundColor(0xFFFF3333); // Red
            isServiceRunning = true;
            Toast.makeText(this, "Đã khởi chạy Tâm Ảo!", Toast.LENGTH_SHORT).show();
        } else {
            stopService(intent);
            btnToggle.setText("BẬT TÂM ẢO");
            btnToggle.setBackgroundColor(0xFF33CC33); // Green
            isServiceRunning = false;
            Toast.makeText(this, "Đã tắt Tâm Ảo!", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == OVERLAY_PERMISSION_REQ_CODE) {
            if (checkOverlayPermission()) {
                toggleCrosshairService();
            } else {
                Toast.makeText(this, "Cấp quyền thất bại! Không thể bật tâm ảo.", Toast.LENGTH_SHORT).show();
            }
        }
    }
}`
    },
    {
      name: 'CrosshairService.java',
      path: 'app/src/main/java/com/aide/customcrosshair/CrosshairService.java',
      language: 'java',
      description: 'Dịch vụ chạy ngầm nâng cao: Cho phép vẽ tâm ảo chính giữa màn hình đồng thời tạo bong bóng nổi (Floating Widget) và bảng menu điều hướng kéo thả trực tiếp trên game để tự do bật/tắt tâm, đổi hình dáng, đổi màu sắc và tinh chỉnh tọa độ một cách tuyệt đối mà không cần thoát game.',
      content: `package com.aide.customcrosshair;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.graphics.Point;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.IBinder;
import android.util.DisplayMetrics;
import android.view.Display;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

public class CrosshairService extends Service {
    private WindowManager windowManager;
    private CrosshairView crosshairView;
    private WindowManager.LayoutParams params;

    // Các thành phần bóng điều khiển nổi (Floating Widget Controls)
    private View floatingWidget;
    private WindowManager.LayoutParams widgetParams;
    private LinearLayout floatingMenu;
    private WindowManager.LayoutParams menuParams;

    private boolean isMenuShowing = false;
    private boolean isCrosshairVisible = true;
    private int currentShapeIndex = 0;
    private int currentColorIndex = 0;

    private final String[] SHAPES = {"cross", "circle", "dot", "t-shape", "chevron", "diamond", "target", "star", "smiley", "rotating"};
    private final int[] COLORS = {0xFF33CC33, 0xFFFF3333, 0xFF3399FF, 0xFFFFFF33, 0xFFFF33FF, 0xFFFFFFFF};
    private final String[] COLOR_NAMES = {"Xanh lá", "Đỏ cực nét", "Xanh lam", "Vàng chanh", "Tím Neon", "Trắng sáng"};

    private static final String CHANNEL_ID = "CustomCrosshairChannel";

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        // Tạo thông báo chạy ngầm bắt buộc đối với Android 8.0 trở lên
        createNotificationChannel();
        Notification notification;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            notification = new Notification.Builder(this, CHANNEL_ID)
                    .setContentTitle("Widget Điều Khiển Nổi Active")
                    .setContentText("Bấm bong bóng nổi để căn chỉnh tâm ảo trực tiếp trên Game.")
                    .setSmallIcon(android.R.drawable.ic_menu_compass)
                    .build();
        } else {
            notification = new Notification();
        }
        startForeground(1, notification);

        windowManager = (WindowManager) getSystemService(Context.WINDOW_SERVICE);
        crosshairView = new CrosshairView(this);

        // Thiết lập tham số hiển thị Overlay nâng cao
        int layoutType = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O ?
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY : WindowManager.LayoutParams.TYPE_PHONE;

        params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                layoutType,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE | 
                WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE | 
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN | 
                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
                PixelFormat.TRANSLUCENT
        );

        params.gravity = Gravity.TOP | Gravity.LEFT;
        
        // Căn chỉnh khoảng cách
        calibrateSystemOverlayPosition();
        windowManager.addView(crosshairView, params);

        // Khởi tạo Widget nổi và bảng thiết lập trực quan trên game
        createFloatingControls();
    }

    private void createFloatingControls() {
        int wType = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O ? 
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY : WindowManager.LayoutParams.TYPE_PHONE;

        // 1. Tạo bóng điều khiển tròn (Floating Widget)
        floatingWidget = new TextView(this);
        TextView widgetText = (TextView) floatingWidget;
        widgetText.setText("🎯");
        widgetText.setGravity(Gravity.CENTER);
        widgetText.setTextSize(20);
        widgetText.setTextColor(Color.WHITE);

        GradientDrawable circleBg = new GradientDrawable();
        circleBg.setShape(GradientDrawable.OVAL);
        circleBg.setColor(0xEE1E293B); // Slate Gray sẫm
        circleBg.setStroke(dpToPx(2), 0xFF10B981); // Viền ngọc lục bảo Emerald cực ngầu
        widgetText.setBackground(circleBg);

        widgetParams = new WindowManager.LayoutParams(
                dpToPx(52), dpToPx(52),
                wType,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT
        );
        widgetParams.gravity = Gravity.TOP | Gravity.LEFT;
        widgetParams.x = 60;
        widgetParams.y = 300;

        // Xử lý kéo thả bóng nổi và bấm để kích hoạt Menu
        floatingWidget.setOnTouchListener(new View.OnTouchListener() {
            private int initialX;
            private int initialY;
            private float initialTouchX;
            private float initialTouchY;
            private long downTime;

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        initialX = widgetParams.x;
                        initialY = widgetParams.y;
                        initialTouchX = event.getRawX();
                        initialTouchY = event.getRawY();
                        downTime = System.currentTimeMillis();
                        return true;
                    case MotionEvent.ACTION_MOVE:
                        widgetParams.x = initialX + (int) (event.getRawX() - initialTouchX);
                        widgetParams.y = initialY + (int) (event.getRawY() - initialTouchY);
                        windowManager.updateViewLayout(floatingWidget, widgetParams);
                        return true;
                    case MotionEvent.ACTION_UP:
                        long duration = System.currentTimeMillis() - downTime;
                        float distance = (float) Math.sqrt(Math.pow(event.getRawX() - initialTouchX, 2) + Math.pow(event.getRawY() - initialTouchY, 2));
                        if (duration < 250 && distance < dpToPx(10)) {
                            toggleFloatingMenu();
                        }
                        return true;
                }
                return false;
            }
        });

        // 2. Tạo Layout Menu Điều Khiển sáp nhập lúc bấm vào bóng
        floatingMenu = new LinearLayout(this);
        floatingMenu.setOrientation(LinearLayout.VERTICAL);
        floatingMenu.setGravity(Gravity.CENTER_HORIZONTAL);
        floatingMenu.setPadding(dpToPx(14), dpToPx(14), dpToPx(14), dpToPx(14));

        GradientDrawable menuBg = new GradientDrawable();
        menuBg.setShape(GradientDrawable.RECTANGLE);
        menuBg.setColor(0xF00F172A); // Nền đen thẫm mờ ảo
        menuBg.setCornerRadius(dpToPx(16));
        menuBg.setStroke(dpToPx(2), 0xFF334155);
        floatingMenu.setBackground(menuBg);

        // Header
        TextView txtTitle = new TextView(this);
        txtTitle.setText("⚡ PANEL ĐIỀU KHIỂN TRÊN GAME");
        txtTitle.setTextColor(0xFF10B981);
        txtTitle.setTextSize(12);
        txtTitle.setTypeface(null, android.graphics.Typeface.BOLD);
        LinearLayout.LayoutParams titleLP = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        titleLP.setMargins(0, 0, 0, dpToPx(8));
        floatingMenu.addView(txtTitle, titleLP);

        // Row D-pad căn trục Y
        LinearLayout rowY = new LinearLayout(this);
        rowY.setOrientation(LinearLayout.HORIZONTAL);
        rowY.setGravity(Gravity.CENTER);
        Button btnUp = createMenuButton("Lên ▲", 0xFF334155);
        btnUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                params.y -= 1;
                windowManager.updateViewLayout(crosshairView, params);
            }
        });
        Button btnDown = createMenuButton("Xuống ▼", 0xFF334155);
        btnDown.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                params.y += 1;
                windowManager.updateViewLayout(crosshairView, params);
            }
        });
        rowY.addView(btnUp);
        rowY.addView(btnDown);
        floatingMenu.addView(rowY);

        // Row D-pad căn trục X + Reset
        LinearLayout rowX = new LinearLayout(this);
        rowX.setOrientation(LinearLayout.HORIZONTAL);
        rowX.setGravity(Gravity.CENTER);
        Button btnLeft = createMenuButton("◀ Trái", 0xFF334155);
        btnLeft.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                params.x -= 1;
                windowManager.updateViewLayout(crosshairView, params);
            }
        });
        Button btnCenter = createMenuButton("Reset Tâm", 0xFF991B1B);
        btnCenter.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                calibrateSystemOverlayPosition();
                windowManager.updateViewLayout(crosshairView, params);
                Toast.makeText(CrosshairService.this, "Đã khôi phục căn đều tâm giữa!", Toast.LENGTH_SHORT).show();
            }
        });
        Button btnRight = createMenuButton("Phải ▶", 0xFF334155);
        btnRight.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                params.x += 1;
                windowManager.updateViewLayout(crosshairView, params);
            }
        });
        rowX.addView(btnLeft);
        rowX.addView(btnCenter);
        rowX.addView(btnRight);
        floatingMenu.addView(rowX);

        // Các nút đổi tính năng nhanh
        LinearLayout rowFeatures = new LinearLayout(this);
        rowFeatures.setOrientation(LinearLayout.HORIZONTAL);
        rowFeatures.setGravity(Gravity.CENTER);

        final Button btnOnOff = createMenuButton("Ẩn/Hiện", 0xFF10B981);
        btnOnOff.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                isCrosshairVisible = !isCrosshairVisible;
                crosshairView.setVisibility(isCrosshairVisible ? View.VISIBLE : View.GONE);
                btnOnOff.setBackgroundColor(isCrosshairVisible ? 0xFF10B981 : 0xFF64748B);
            }
        });

        Button btnShape = createMenuButton("Đổi Kiểu", 0xFF2563EB);
        btnShape.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                currentShapeIndex = (currentShapeIndex + 1) % SHAPES.length;
                crosshairView.setShape(SHAPES[currentShapeIndex]);
                Toast.makeText(CrosshairService.this, "Tâm ảo: " + SHAPES[currentShapeIndex].toUpperCase(), Toast.LENGTH_SHORT).show();
            }
        });

        Button btnColor = createMenuButton("Đổi Màu", 0xFFD97706);
        btnColor.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                currentColorIndex = (currentColorIndex + 1) % COLORS.length;
                crosshairView.setColor(COLORS[currentColorIndex]);
                Toast.makeText(CrosshairService.this, "Đã áp dụng màu: " + COLOR_NAMES[currentColorIndex], Toast.LENGTH_SHORT).show();
            }
        });

        rowFeatures.addView(btnOnOff);
        rowFeatures.addView(btnShape);
        rowFeatures.addView(btnColor);
        floatingMenu.addView(rowFeatures);

        // Nút Đóng menu
        Button btnClose = createMenuButton("❌ Đóng Trình Điều Khiển", 0xFF4B5563);
        btnClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                toggleFloatingMenu();
            }
        });
        floatingMenu.addView(btnClose);

        // Cài đặt Parameters cho Menu Nổi
        menuParams = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                wType,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT
        );
        menuParams.gravity = Gravity.CENTER;
    }

    private Button createMenuButton(String text, int bgColor) {
        Button btn = new Button(this);
        btn.setText(text);
        btn.setTextColor(Color.WHITE);
        btn.setTextSize(10);
        btn.setPadding(dpToPx(10), dpToPx(8), dpToPx(10), dpToPx(8));

        GradientDrawable btnBg = new GradientDrawable();
        btnBg.setColor(bgColor);
        btnBg.setCornerRadius(dpToPx(8));
        btn.setBackground(btnBg);

        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        lp.setMargins(dpToPx(4), dpToPx(6), dpToPx(4), dpToPx(6));
        btn.setLayoutParams(lp);
        return btn;
    }

    private void toggleFloatingMenu() {
        if (!isMenuShowing) {
            windowManager.addView(floatingMenu, menuParams);
            isMenuShowing = true;
        } else {
            windowManager.removeView(floatingMenu);
            isMenuShowing = false;
        }
    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round(dp * density);
    }

    /**
     * THUẬT TOÁN ĐỘC QUYỀN: Tự động quét phần cứng màn hình,
     * tự bù sai số do tai thỏ (notches), camera đục lỗ (display cutouts),
     * và phím điều hướng (navigation bar) của máy để định cấu hình tâm đúng 100%.
     */
    private void calibrateSystemOverlayPosition() {
        if (windowManager == null || params == null) return;

        int screenWidth = 0;
        int screenHeight = 0;

        // 1. Lấy thông số độ phân giải phần cứng thực tế (Real Resolution)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            Point realSize = new Point();
            Display display = windowManager.getDefaultDisplay();
            display.getRealSize(realSize);
            screenWidth = realSize.x;
            screenHeight = realSize.y;
        } else {
            DisplayMetrics metrics = new DisplayMetrics();
            windowManager.getDefaultDisplay().getMetrics(metrics);
            screenWidth = metrics.widthPixels;
            screenHeight = metrics.heightPixels;
        }

        // 2. Tính toán chính giữa (Absolute Physical Center)
        int centerX = screenWidth / 2;
        int centerY = screenHeight / 2;

        // 3. Đo lường kích thước CrosshairView thực tế để căn lùi tâm chính xác
        crosshairView.measure(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED);
        int viewWidth = crosshairView.getMeasuredWidth();
        int viewHeight = crosshairView.getMeasuredHeight();

        // 4. Bù sai lệch trục (Offset) do chiều của điện thoại (Xoay Ngang - Landscape / Xoay Dọc - Portrait)
        int orientation = getResources().getConfiguration().orientation;
        
        // Bù đắp phần cứng đặc biệt: Hệ điều hành Android đẩy dịch chuyển cửa sổ vì Tai Thỏ
        int compensationX = 0;
        int compensationY = 0;

        if (orientation == Configuration.ORIENTATION_LANDSCAPE) {
            // Khi chơi game xoay ngang: hầu như tất cả game mobile (Free Fire, PUBG, Wild Rift...)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                // Tự động triệt tiêu khoảng không tai thỏ bên trái/phải nếu máy có nốt ruồi
                compensationX = getNotchCompensationX();
            }
        } else {
            // Khi xoay dọc
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                compensationY = getNotchCompensationY();
            }
        }

        // Tọa độ XY cuối cùng để vẽ tâm đè lên trên chính xác trục tâm màn hình game 
        params.x = centerX - (viewWidth / 2) + compensationX;
        params.y = centerY - (viewHeight / 2) + compensationY;
    }

    private int getNotchCompensationX() {
        try {
            int resourceId = getResources().getIdentifier("status_bar_height", "dimen", "android");
            if (resourceId > 0) {
                return - (getResources().getDimensionPixelSize(resourceId) / 2);
            }
        } catch (Exception e) {
            // bỏ qua
        }
        return 0;
    }

    private int getNotchCompensationY() {
        try {
            int resourceId = getResources().getIdentifier("status_bar_height", "dimen", "android");
            if (resourceId > 0) {
                return - (getResources().getDimensionPixelSize(resourceId) / 2);
            }
        } catch (Exception e) {
            // bỏ qua
        }
        return 0;
    }

    // Tự động tính toán lại tâm tuyệt đối và di chuyển cửa sổ khi phát hiện người dùng xoay ngang/xoay dọc máy để chơi game
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        if (windowManager != null && crosshairView != null && params != null) {
            calibrateSystemOverlayPosition();
            windowManager.updateViewLayout(crosshairView, params);
        }
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Tâm Ảo Foreground Service Channel",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(serviceChannel);
            }
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (windowManager != null) {
            if (crosshairView != null) {
                windowManager.removeView(crosshairView);
            }
            if (floatingWidget != null) {
                windowManager.removeView(floatingWidget);
            }
            if (isMenuShowing && floatingMenu != null) {
                windowManager.removeView(floatingMenu);
            }
        }
    }
}`
    },
    {
      name: 'CrosshairView.java',
      path: 'app/src/main/java/com/aide/customcrosshair/CrosshairView.java',
      language: 'java',
      description: 'View vẽ đồ họa tự chọn. File này đã được customize các hằng số màu sắc, kích thước chính xác theo bản thiết kế hiện tại của bạn.',
      content: `package com.aide.customcrosshair;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.view.View;

public class CrosshairView extends View {
    // CẤU HÌNH ĐƯỢC TỰ ĐỘNG GENERATE TỪ THIẾT KẾ CỦA BẠN:
    private String SHAPE = "${config.shape}";
    private int SIZE_DP = ${config.size}; // Kích thước tổng thể
    private float OPACITY = ${config.opacity}f; // Độ mờ
    private float THICKNESS = ${config.thickness}f; // Độ dày nét vẽ
    private int COLOR = ${colorVal}; // Màu chính
    private float GAP = ${config.gap}f; // Khoảng cách khe hở giữa tâm
    
    private boolean HAS_DOT = ${hasDotVal};
    private float DOT_SIZE = ${config.dotSize}f;
    private int DOT_COLOR = ${dotColorVal};
    
    private boolean HAS_OUTLINE = ${hasOutlineVal};
    private int OUTLINE_COLOR = ${outlineColorVal};
    private float OUTLINE_THICKNESS = ${config.outlineThickness}f;
    private float ROTATION = ${config.rotation}f;

    private Paint paint;
    private Paint outlinePaint;
    private Paint dotPaint;

    public void setShape(String shape) {
        this.SHAPE = shape;
        invalidate();
    }

    public void setColor(int color) {
        this.COLOR = color;
        if (paint != null) {
            paint.setColor(color);
            paint.setAlpha((int) (OPACITY * 255));
        }
        invalidate();
    }

    public CrosshairView(Context context) {
        super(context);
        init();
    }

    private void init() {
        paint = new Paint();
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeCap(Paint.Cap.ROUND);
        paint.setAntiAlias(true);
        // Thiết lập Alpha theo Opacity và đặt màu sắc chính
        paint.setColor(COLOR);
        paint.setAlpha((int) (OPACITY * 255));
        paint.setStrokeWidth(dpToPx(THICKNESS));

        if (HAS_OUTLINE) {
            outlinePaint = new Paint();
            outlinePaint.setStyle(Paint.Style.STROKE);
            outlinePaint.setStrokeCap(Paint.Cap.ROUND);
            outlinePaint.setAntiAlias(true);
            outlinePaint.setColor(OUTLINE_COLOR);
            outlinePaint.setAlpha((int) (OPACITY * 255));
            outlinePaint.setStrokeWidth(dpToPx(THICKNESS + OUTLINE_THICKNESS * 2));
        }

        if (HAS_DOT) {
            dotPaint = new Paint();
            dotPaint.setStyle(Paint.Style.FILL);
            dotPaint.setAntiAlias(true);
            dotPaint.setColor(DOT_COLOR);
            dotPaint.setAlpha((int) (OPACITY * 255));
        }
    }

    private int dpToPx(float dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round(dp * density);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        // Đặt kích thước của View chứa tâm ảo, cộng thêm biên cho viền stroke
        int sizePx = dpToPx(SIZE_DP + (THICKNESS + OUTLINE_THICKNESS * 2) * 2);
        setMeasuredDimension(sizePx, sizePx);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        
        int center = getWidth() / 2;
        int sizePx = dpToPx(SIZE_DP);
        float radius = sizePx / 2f;
        float gapPx = dpToPx(GAP);

        canvas.save();
        // Áp dụng góc xoay nếu có
        if (ROTATION != 0) {
            canvas.rotate(ROTATION, center, center);
        }

        // 1. Vẽ outlines (viền nét) trước để nằm phía dưới tâm chính
        if (HAS_OUTLINE && outlinePaint != null) {
            drawCrosshairShapes(canvas, center, radius, gapPx, outlinePaint);
        }

        // 2. Vẽ tâm chính
        drawCrosshairShapes(canvas, center, radius, gapPx, paint);

        // 3. Vẽ chấm tròn tại trung tâm (nằm trên cùng và không bị xoay)
        canvas.restore(); // Khôi phục lại trạng thái không dính xoay ROTATION
        if (HAS_DOT && dotPaint != null) {
            canvas.drawCircle(center, center, dpToPx(DOT_SIZE / 2), dotPaint);
        }
    }

    private void drawCrosshairShapes(Canvas canvas, int center, float size, float gap, Paint paintToUse) {
        // Vẽ các loại tâm theo cấu hình của người dùng
        if ("dot".equals(SHAPE)) {
            // Dạng chấm nguyên bản (Nếu không bật HAS_DOT bên ngoài)
            if (!HAS_DOT) {
                Paint fillPaint = new Paint(paintToUse);
                fillPaint.setStyle(Paint.Style.FILL);
                canvas.drawCircle(center, center, size / 4f, fillPaint);
            }
        } 
        else if ("circle".equals(SHAPE)) {
            // Tâm dạng vòng tròn
            canvas.drawCircle(center, center, size / 2f, paintToUse);
        } 
        else if ("cross".equals(SHAPE)) {
            // Thập tự truyền thống (+), có chừa khe hở ở giữa nếu GAP > 0
            float start = gap;
            float end = size;
            
            // Trái
            canvas.drawLine(center - end, center, center - start, center, paintToUse);
            // Phải
            canvas.drawLine(center + start, center, center + end, center, paintToUse);
            // Trên
            canvas.drawLine(center, center - end, center, center - start, paintToUse);
            // Dưới
            canvas.drawLine(center, center + start, center, center + end, paintToUse);
        } 
        else if ("t-shape".equals(SHAPE)) {
            // Dạng chữ T (bỏ thanh ở trên)
            float start = gap;
            float end = size;
            
            // Trái
            canvas.drawLine(center - end, center, center - start, center, paintToUse);
            // Phải
            canvas.drawLine(center + start, center, center + end, center, paintToUse);
            // Dưới (thanh dọc bên dưới)
            canvas.drawLine(center, center + start, center, center + end, paintToUse);
        } 
        else if ("chevron".equals(SHAPE)) {
            // Dạng dấu mũ quân đội ^
            Path chevronPath = new Path();
            float halfX = size / 2f;
            chevronPath.moveTo(center - halfX, center + halfX);
            chevronPath.lineTo(center, center - halfX / 2f);
            chevronPath.lineTo(center + halfX, center + halfX);
            canvas.drawPath(chevronPath, paintToUse);
        } 
        else if ("diamond".equals(SHAPE)) {
            // Dạng hình thoi 
            Path diamondPath = new Path();
            diamondPath.moveTo(center, center - radius);
            diamondPath.lineTo(center + radius, center);
            diamondPath.lineTo(center, center + radius);
            diamondPath.lineTo(center - radius, center);
            diamondPath.close();
            canvas.drawPath(diamondPath, paintToUse);
        }
        else if ("target".equals(SHAPE)) {
            // Dạng bia nhắm: Thập tự + Vòng tròn
            canvas.drawCircle(center, center, size / 3f, paintToUse);
            float start = gap;
            float end = size;
            canvas.drawLine(center - end, center, center - start, center, paintToUse);
            canvas.drawLine(center + start, center, center + end, center, paintToUse);
            canvas.drawLine(center, center - end, center, center - start, paintToUse);
            canvas.drawLine(center, center + start, center, center + end, paintToUse);
        }
        else if ("star".equals(SHAPE)) {
            // Vẽ hình sao 4 cánh nhọn
            Path starPath = new Path();
            starPath.moveTo(center, center - radius);
            starPath.quadTo(center, center, center + radius, center);
            starPath.quadTo(center, center, center, center + radius);
            starPath.quadTo(center, center, center - radius, center);
            starPath.quadTo(center, center, center, center - radius);
            starPath.close();
            
            Paint fillOrStroke = new Paint(paintToUse);
            if (paintToUse.getStyle() == Paint.Style.STROKE) {
                canvas.drawPath(starPath, paintToUse);
            } else {
                fillOrStroke.setStyle(Paint.Style.FILL);
                canvas.drawPath(starPath, fillOrStroke);
            }
        }
        else if ("smiley".equals(SHAPE)) {
            // Smiley vui nhộn làm tâm ảo
            // Vòng tròn đầu
            canvas.drawCircle(center, center, radius, paintToUse);
            // Mắt trái, mắt phải (vẽ dạng chấm nhỏ)
            Paint fillPaint = new Paint(paintToUse);
            fillPaint.setStyle(Paint.Style.FILL);
            canvas.drawCircle(center - radius/3f, center - radius/4f, size/12f, fillPaint);
            canvas.drawCircle(center + radius/3f, center - radius/4f, size/12f, fillPaint);
            // Miệng cười
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                canvas.drawArc(center - radius/2f, center - radius/3f, center + radius/2f, center + radius/2f, 20, 140, false, paintToUse);
            } else {
                // Hỗ trợ đời cũ
                canvas.drawLine(center - radius/3f, center + radius/6f, center + radius/3f, center + radius/6f, paintToUse);
            }
        }
        else if ("rotating".equals(SHAPE)) {
            // Vẽ 3 cánh quạt đối xứng 120 độ
            for (int i = 0; i < 3; i++) {
                canvas.save();
                canvas.rotate(i * 120f, center, center);
                Path bladePath = new Path();
                bladePath.moveTo(center, center - GAP);
                bladePath.quadTo(center + radius * 0.5f, center - radius * 0.5f, center + radius * 0.85f, center - radius * 0.15f);
                canvas.drawPath(bladePath, paintToUse);
                canvas.restore();
            }
            // Vòng tròn định tâm phụ
            canvas.drawCircle(center, center, Math.max(4, radius * 0.45f), paintToUse);
        }
    }
}`
    },
    {
      name: 'activity_main.xml',
      path: 'app/src/main/res/layout/activity_main.xml',
      language: 'xml',
      description: 'Giao diện chính chứa các điều khiển và nút bấm khởi chạy, cực kỳ dễ dùng và trực quan trên điện thoại.',
      content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_match"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center"
    android:padding="24dp"
    android:background="#121212">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="TÂM ẢO GAME MOBILE"
        android:textColor="#FFFFFF"
        android:textSize="24sp"
        android:textStyle="bold"
        android:layout_marginBottom="8dp" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Mã nguồn biên dịch hoàn hảo trên điện thoại bằng AIDE"
        android:textColor="#888888"
        android:textSize="12sp"
        android:layout_marginBottom="40dp"
        android:gravity="center" />

    <View
        android:layout_width="120dp"
        android:layout_height="120dp"
        android:background="@android:drawable/ic_menu_compass"
        android:layout_marginBottom="40dp" />

    <Button
        android:id="@+id/btn_toggle"
        android:layout_width="match_parent"
        android:layout_height="56dp"
        android:text="BẬT TÂM ẢO"
        android:textColor="#FFFFFF"
        android:textSize="18sp"
        android:textStyle="bold"
        android:background="#33CC33"
        android:backgroundTint="#33CC33"
        android:elevation="4dp" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="* Hãy đảm bảo đã cấp Quyền vẽ lên ứng dụng khác khi bấm nút."
        android:textColor="#FF9900"
        android:textSize="12sp"
        android:layout_marginTop="20dp"
        android:gravity="center" />
</LinearLayout>`
    },
    {
      name: 'styles.xml',
      path: 'app/src/main/res/values/styles.xml',
      language: 'xml',
      description: 'File phong cách giao diện của app chính, cấu hình màu sắc tương thích tối đa.',
      content: `<resources>
    <!-- Base application theme. -->
    <style name="AppTheme" parent="android:Theme.Material.Light.NoActionBar">
        <!-- Customize your theme here. -->
        <item name="android:colorPrimary">#121212</item>
        <item name="android:colorPrimaryDark">#000000</item>
        <item name="android:colorAccent">#33CC33</item>
    </style>
</resources>`
    }
  ];
}
