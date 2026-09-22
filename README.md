# Resume Portfolio Skill

提供给 Codex、Claude Code 等代码 Agent 的交互式简历网站复刻项目。下载项目，交给 Agent 一份简历、几组人物动作视频和机构 Logo，就能沿用现有视觉与交互完成个人网站。

## 开始

下载 ZIP 并解压，或 clone 本仓库。在任意 Agent 中输入：

> 请读取项目根目录 SKILL.md，检查素材目录，告诉我还需要准备哪些简历、绿幕动作视频、照片和 Logo。材料齐全后，分析简历并替换文案与素材，完成我的网页简历复刻和浏览器验收。

支持 AGENTS.md 的 Agent 可自动发现入口；其他 Agent 必须显式读取 SKILL.md。下载动作本身不会弹窗，也不会自动启动制作。

准备材料的位置：`inputs/resume/`、`inputs/videos/`、`inputs/photos/`、`inputs/logos/`、`inputs/models/`。

[素材拍摄与命名指南](references/materials.md) · [文案与页面替换指南](references/adaptation.md)

## 本地命令

需要 Node.js 22.12+；绿幕处理还需 PATH 中的 FFmpeg（含 libvpx-vp9）。

```sh
npm ci
npm run intake
npm run media
npm run build
npm run preview
```

未放素材也能构建并展示占位图，不能视为完成的个人网站。仓库保留原 Demo 的布局与交互，不附带原人物简历、肖像视频、机构 Logo、联系方式或模型。提供自己的素材并确认有权公开使用。

## 作为 Skill 使用

根目录本身就是完整的 `resume-portfolio-skill` 文件夹。可将整个仓库放入 Agent 支持的 Skills 目录，或直接作为工作项目使用。不可只复制 SKILL.md 而遗漏源码和 references。