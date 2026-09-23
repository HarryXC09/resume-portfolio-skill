# Word 文案输入表

`template/resume-portfolio-content-template-v2.docx` 是人物 Portfolio 模板的文字唯一输入表。用户可以直接在 Word 表格的“可编辑内容”列修改姓名、双语文案、教育工作经历、项目 / 作品 / 奖项 / 研究 / 论文和联系方式；“字段路径”列不要修改。

## 转换为 profile.json

```powershell
python scripts/word_to_profile.py template/resume-portfolio-content-template-v2.docx --out profile.json
```

脚本会读取所有表格行，将字段路径写入 `profile.json`。其中 `modules[]` 是高密度通用模块草稿：Agent 先根据 CV 选择 `project`、`portfolio`、`award`、`research`、`publication`、`practice` 等类型，再把 1–3 个最有证据的模块映射到网站现有视觉槽位，必要时调整对应 section 的标题和字段映射。随后按 `template/README.md` 的流程同步到 `src/content/profile.js`，再运行构建和验收。

Word 表只负责文字。照片、Logo、视频和 3D 模型仍放在 `inputs/` 对应目录，并由素材处理脚本生成网页资源。不要把未经简历核实的经历写进表格；联系方式只有获得本人公开授权后才填写。
