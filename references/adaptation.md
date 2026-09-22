# 从材料到网页

## 分析

使用 Agent 可用的文档工具读取简历，扫描 PDF 需要 OCR；工具不可用时请用户提供可读版本。记录 `work/facts.md`：原文位置、事实、拟发布文案、疑点。整理 `work/material-map.md`：原文件、实际画面、页面用途、产物路径。不要猜姓名读音、机构英文名、职称或成果数量。

## 页面映射

| 内容 | 位置与字段 |
| --- | --- |
| 姓名/职业/关键词 | profile.identity → header、Hero、跑马灯、footer |
| 简介与能力 | profile.about.intro、dimensions，每行英文标签/中文标签/中文描述/英文描述 |
| 经验或技能卡片 | profile.clinical.cards，每项 name/zh/body[中,英]/video/tag |
| 时间线 | profile.journey.entries，每项日期/英文标题/中文标题/中文描述/英文描述/Logo文件名或null |
| 专业主题 | profile.research.topics，每项英文多行标题/中文描述/英文描述 |
| 代表作品 | profile.publication，论文或项目；没有则隐藏 Publication 或改成有事实依据的作品 |
| 公开联系 | profile.contact，空值不渲染链接 |
| 视频镜头 | profile.media.hero/about/contact 与 cards[].video，编号对应素材表 |

profile.js 使用 JavaScript export，不要把 JSON 文件放一边却忘记页面数据。双语内容从同一事实导出。

## 必须检查的结构位置

- index.html：title 和 description；不包含原简历隐私。
- App.jsx：通用标题与 Hero 标语，以及 About 的按钮数量。名称较长时调整字号，不能剪掉名字。
- Journey.jsx / JourneyIcon.jsx：无 Logo 时图标按原序号回退；新职业必要时换中性图标。Logo 从 inputs/logos 复制到 public/logos，并写入 entries[][5]。
- Clinical.jsx：支持数组长度计算。删除卡片后验收左右切换；少于三张可改为静态布局，避免卡片效果不成立。
- Research.jsx / lib/cell.js：原视觉是医学细胞背景；不能把肿瘤图注用于其他职业。无模型时改为项目图片，保持配色与布局，并移除不需要的加载逻辑。
- Contact.jsx：RESEARCH/PRACTICE 和动作 alt text 根据画面调整。
- 样式中的 journey 卡片数量、About 网格等需按实际内容目视验收。模板不是任意数组长度无需检查的 CMS。

## 验收

运行 build 并以本次 dist 预览。浏览器检查 1440×900 和 390×844：首屏人物比例与滚动收缩、About 切换、轮播按钮和拖动、时间线叠卡、研究区、双语与联系入口。检查 console/pageerror、横向溢出、视频实际播放、透明背景和 poster fallback。缺图片或模型不能仅以无 JS 错误判定通过。

搜索源文件和构建输出中的 YOUR NAME、你的姓名、待填写、MILESTONE、原人物姓名及旧联系人。逐项处理，不能批量把缺失事实替成虚构文案。交付验收报告记录实际 URL、日期、素材使用、未完成项。
