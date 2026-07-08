const fs = require('fs');
const path = require('path');

const files = [
  'src/app/accessories/page.tsx',
  'src/components/Header.tsx',
  'src/components/ProductCard.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Only replace if it doesn't already have it
    content = content.replace(/<button(?!\s+suppressHydrationWarning)/g, '<button suppressHydrationWarning');
    content = content.replace(/<input(?!\s+suppressHydrationWarning)/g, '<input suppressHydrationWarning');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
