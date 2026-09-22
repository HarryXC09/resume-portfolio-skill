# Agent 入口

本项目用于从简历和人物素材复刻个人 Portfolio 网站。

当用户要求开始、制作、替换人物或复刻时，先读取根目录 `SKILL.md` 并运行 `node scripts/intake.mjs`。列出缺少的材料和固定目录，引导用户准备简历、绿幕动作视频、照片、学校/单位 Logo，然后完成文案和素材替换。

`src/content/profile.js` 是文案事实的唯一页面数据入口。不要把 inputs、work 或原始简历放入构建或 Git。保留未知的用户修改。不要将示例占位文案当作用户事实。

任何 Agent 都可直接遵循 SKILL.md；Agent 若不自动读取 AGENTS.md，请用户明确说“请读取 SKILL.md 并开始”。下载文件本身不会自动执行 Agent 或弹出提醒。
