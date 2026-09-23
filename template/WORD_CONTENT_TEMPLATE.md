# Word 文案输入表

`template/resume-portfolio-content-template.docx` 是人物 Portfolio 模板的文字唯一输入表。用户可以直接在 Word 表格的“可编辑内容”列修改姓名、双语文案、教育工作经历、研究主题、论文和联系方式；“字段路径”列不要修改。

## 转换为 profile.json

```powershell
python scripts/word_to_profile.py template/resume-portfolio-content-template.docx --out profile.json
```

脚本会读取所有表格行，将字段路径写入 `profile.json`。随后按 `template/README.md` 的流程把内容映射到 `src/content/profile.js`，再运行构建和验收。

Word 表只负责文字。照片、Logo、视频和 3D 模型仍放在 `inputs/` 对应目录，并由素材处理脚本生成网页资源。不要把未经简历核实的经历写进表格。
