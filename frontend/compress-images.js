const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = './public/images/landing';
const maxWidth = 1920;
const quality = 75;

const heavyImages = [
  'confident-professional-coach-leadership.webp',
  'group-coaching-session-facilitation.webp', 
  'professional-business-coach-team-training.webp'
];

async function compress() {
  for (const img of heavyImages) {
    const inputPath = path.join(dir, img);
    const outputPath = path.join(dir, img.replace('.webp', '-temp.webp'));
    
    if (!fs.existsSync(inputPath)) {
      console.log(`❌ No existe: ${img}`);
      continue;
    }
    
    const statBefore = fs.statSync(inputPath);
    console.log(`Comprimiendo ${img} (${(statBefore.size/1024/1024).toFixed(2)}MB)...`);
    
    await sharp(inputPath)
      .resize(maxWidth, null, { withoutEnlargement: true })
      .webp({ quality })
      .toFile(outputPath);
    
    // Reemplazar original
    fs.unlinkSync(inputPath);
    fs.renameSync(outputPath, inputPath);
    
    const statAfter = fs.statSync(inputPath);
    console.log(`✅ ${img}: ${(statBefore.size/1024/1024).toFixed(2)}MB → ${(statAfter.size/1024).toFixed(0)}KB`);
  }
}

compress().then(() => console.log('\n🎉 Compresión completada'));
