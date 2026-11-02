# 物理展开 · Physics Unfolded

在线体验：[physics.selfworks.ai](https://physics.selfworks.ai/)

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


## 项目结构

每个章节目录包含 `pages.js`（正文与拆解说明）、`practice.js`（练习与解析）、`world.js`（图示）、`model.js`（物理计算）和 `checks.mjs`（数值检查）。共享交互位于 `engine/`，公式表位于 `equations/`。

中文化保持原有物理模型、单位、公式、题目数值及正确答案索引。


## 来源与许可

原作者：Nathan Liow。上游版本：`bcd67d9`，取自用户提供的 [Kayce001/atlas-of-physics](https://github.com/Kayce001/atlas-of-physics) Fork。保留原 Git 历史、作者署名与 [MIT 许可证](LICENSE)。

AP® 是 College Board 的商标；College Board 未对本项目作出认可或背书。
