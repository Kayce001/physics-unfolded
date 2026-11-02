# 物理展开 · Physics Unfolded

用可以旋转、拆解和翻页的三维图示学习物理。

本项目是 [Nathan Liow 的 Atlas of Physics](https://github.com/nathanliow/atlas-of-physics) 的简体中文翻译版，覆盖 AP Physics 1、AP Physics C 力学与电磁学。中文版本维护于 [Kayce001/physics-unfolded](https://github.com/Kayce001/physics-unfolded)。

> 翻译状态：机器翻译初稿，并对关键物理术语、公式和交互进行校正与检查。尚未完成全书逐句的专业人工审校，遇到不自然或不准确的表述欢迎提交 Issue。英文原始项目说明见 [README.upstream.md](README.upstream.md)。

## 内容

共 15 章、161 页，包含正文、三维图示拆解、练习题与解析、跨章节对照链接和公式表。

| 力学 | 电磁学 |
| --- | --- |
| 运动学、牛顿运动定律、圆周运动 | 静电学、高斯定律、电势 |
| 功与能、动量、振动 | 电容器、电路 |
| 转动、流体 | 磁场、电磁感应 |

## 本地运行

需要 Python 3，直接启动静态服务器：

```powershell
cd physics-unfolded
python -m http.server 8137
```

浏览器打开 <http://127.0.0.1:8137/>。

正式使用只需要静态文件服务器；不需要 Node.js 后端。浏览器通过 jsDelivr 加载 three.js，通过 Google Fonts 加载拉丁字体，因此首次打开需要联网。中文字体优先使用系统字体。

- 滚动或使用方向键翻页。
- 拖动旋转图示，Shift + 拖动平移。
- 点击物体或矢量查看拆解说明，Esc 关闭。
- 手机可滑动翻页，点按图示查看拆解。
- 章节深链接如 `kinematics/#4` 可直接定位指定页面。

## 开发与检查

需要 Node.js 22 或更新版本。

```powershell
npm ci
npm run check
```

检查入口兼容 Windows、macOS 与 Linux，运行全部章节原有的物理不变量、练习数值检查及公式链接检查。

浏览器测试需要本地服务器和 Chrome：

```powershell
$env:CHROME = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
node tools/zh-smoke.mjs
```

翻译工具 `tools/localize.mjs` 与 `tools/translate.py` 仅在制作翻译时使用，网站运行时不会调用翻译服务。工具从英文源码中提取可见文字，保护代码插值及 HTML 标记，缓存结果并验证后再写回；请勿对已翻译的工作树重复运行提取/回写。翻译统计见 [TRANSLATION_REPORT.json](TRANSLATION_REPORT.json)，进度与验收记录见 [WORK_PLAN.md](WORK_PLAN.md)。

## 项目结构

每个章节目录包含 `pages.js`（正文与拆解说明）、`practice.js`（练习与解析）、`world.js`（图示）、`model.js`（物理计算）和 `checks.mjs`（数值检查）。共享交互位于 `engine/`，公式表位于 `equations/`。

中文化保持原有物理模型、单位、公式、题目数值及正确答案索引。

## 来源与许可

原作者：Nathan Liow。上游版本：`bcd67d9`，取自用户提供的 [Kayce001/atlas-of-physics](https://github.com/Kayce001/atlas-of-physics) Fork。保留原 Git 历史、作者署名与 [MIT 许可证](LICENSE)。

AP® 是 College Board 的商标；College Board 未对本项目作出认可或背书。
