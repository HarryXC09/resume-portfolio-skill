# 默认素材索引

仓库自带一份可替换的默认 3D 模型：`public/models/tumor-cell-default.glb`。

- 用途：Research 区的延迟加载互动模型
- 来源：本项目原有 `assets/models/tumor-cell-web.glb` 网页候选文件
- 规格：约 约 435 KB，轻量低面数网页默认模型，已通过网页运行验收
- 替换：将新人的 `.glb` 优化为网页可接受大小后覆盖该路径，并保持 `src/lib/cell.js` 的加载路径；如果职业不需要 3D 模型，按 `references/adaptation.md` 改为项目图片或隐藏该区块
- 原则：不要把未经确认的医学模型解释为新人的专业经历；模型只是默认视觉素材

用户简历、照片、原始视频和 Logo 不随仓库提供，必须从 `inputs/` 进入项目，并按来源和公开授权验收。

