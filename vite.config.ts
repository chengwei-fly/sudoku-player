import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // base 路径说明：
  // - GitHub Pages 部署：使用项目子路径 '/sudoku-player/'
  // - Android APK (Capacitor) 打包：必须使用相对路径 './'，
  //   否则 WebView 从 https://localhost/ 加载会找不到 /sudoku-player/... 下的资源，导致白屏
  // - 本地开发：使用相对路径 './'
  base: process.env.GITHUB_PAGES
    ? '/sudoku-player/'
    : process.env.ANDROID_BUILD
      ? './'
      : './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/algorithms': path.resolve(__dirname, './src/algorithms'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/variables.scss";'
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts']
  }
})
