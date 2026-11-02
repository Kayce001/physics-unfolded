import fs from 'node:fs';
const dictionary = JSON.parse(fs.readFileSync(new URL('./zh.json', import.meta.url),'utf8'));
export function localizeHtml(html) {
  return html.replace('lang="en"','lang="zh-CN"')
    .replaceAll('https://github.com/nathanliow/atlas-of-physics','https://github.com/Kayce001/physics-unfolded')
    .replace(/<script defer src="\/_vercel\/insights\/script.js"><\/script>/g,'')
    .replace(/>([^<>]+)</g, (m,text) => {
      const translation = dictionary[text.trim()];
      return translation ? '>' + text.replace(text.trim(),()=>translation) + '<' : m;
    })
    .replace(/\b(placeholder|aria-label)="([^"]+)"/g, (m,attr,text) => dictionary[text] ? `${attr}="${dictionary[text]}"` : m)
    .replace('<title>Equation sheet · Atlas of Physics</title>','<title>公式表 · 物理展开</title>');
}
