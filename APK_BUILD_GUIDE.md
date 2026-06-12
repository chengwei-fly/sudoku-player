# 数独玩家 - APK 打包指南（PWABuilder 方案）

> 本项目已配置为 PWA（Progressive Web App），可通过 PWABuilder 一键打包为 Android APK，**无需本地安装 Android SDK / JDK 17+**。

---

## 当前状态

| 项目 | 状态 |
|------|------|
| Vite 构建 | ✅ 已完成（`npm run build`） |
| PWA Manifest | ✅ `/dist/manifest.json` |
| Service Worker | ✅ `/dist/sw.js`（离线访问支持） |
| 应用图标 | ✅ 192×192、512×512 PNG 已生成 |
| Capacitor Android 平台 | ✅ 已添加（备选方案） |

---

## 方法 1：使用 PWABuilder（推荐，无需本地工具链）

### 步骤 1：部署 dist 目录
PWABuilder 需要一个公网可访问的 URL。请将 `dist/` 目录部署到任意静态托管：

- **Vercel**（最简单）：`npm i -g vercel && vercel --prod`
- **Netlify**：把 `dist` 拖到 https://app.netlify.com/drop
- **GitHub Pages**：推送到 `gh-pages` 分支

### 步骤 2：在 PWABuilder 上打包
1. 打开 https://www.pwabuilder.com/
2. 把您的 URL 粘进去 → 点 **Start**
3. 等待 PWABuilder 校验（满分 100 即可）
4. 点 **Package For Stores** → 选 **Android**
5. 配置：
   - Package ID: `com.sudoku.player`
   - App name: `数独玩家`
   - Display: `standalone`
   - Orientation: `portrait`
6. 点 **Generate** → 下载 `.apk` 和 `.aab`

### 步骤 3：安装到手机/平板
- USB 数据线连接 Android 设备到电脑
- 启用手机的 **开发者模式** → **USB 调试**
- 把 APK 拖入手机或：
  ```bash
  adb install app-debug.apk
  ```
- 或直接把 APK 发到手机微信/QQ 即可点开安装（需开启"允许未知来源"）

---

## 方法 2：使用 Capacitor（已配好，但需安装工具链）

我已为您添加好 Capacitor Android 平台，但 **打包需要本地安装**：

1. **JDK 17+**：https://adoptium.net/
2. **Android Studio**：https://developer.android.com/studio
3. 打开 Android Studio → SDK Manager → 安装 Android 14 (API 34) SDK
4. 设置环境变量：
   ```
   setx ANDROID_HOME "C:\Users\你的用户名\AppData\Local\Android\Sdk"
   setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-17"
   ```
5. 在项目目录执行：
   ```bash
   npx cap sync android
   cd android
   .\gradlew.bat assembleDebug
   ```
6. APK 位置：`android\app\build\outputs\apk\debug\app-debug.apk`

---

## 方法 3：直接用浏览器测试（最快）

- 电脑和手机/平板连同一 WiFi
- 启动 Vite dev 服务器：`npm run dev`（已运行）
- 浏览器（手机）访问 `http://电脑IP:5173`
- 立即在真机上体验游戏

---

## 后续优化

- [ ] 添加应用截图（用于商店）
- [ ] 申请正式签名证书（生产环境）
- [ ] 上架应用商店
- [ ] 添加更多题目等级
- [ ] 添加排行榜
- [ ] 添加每日挑战
