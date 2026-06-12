// 将 SVG 图标转为 PWA 所需的 PNG 尺寸
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SIZES = [192, 512]
const svgPath = path.join(__dirname, '..', 'public', 'icons', 'icon.svg')
const outDir = path.join(__dirname, '..', 'public', 'icons')

async function main() {
  const svgBuffer = await sharp(svgPath).toBuffer()
  for (const size of SIZES) {
    const outPath = path.join(outDir, `icon-${size}.png`)
    await sharp(svgBuffer).resize(size, size).png().toFile(outPath)
    console.log(`生成: ${outPath} (${size}x${size})`)
  }
  console.log('图标生成完成')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
