from copy import deepcopy
from pathlib import Path
from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.text.run import Run

SOURCE = Path('template/resume-portfolio-layout-source.docx')
OUTPUT = Path('template/resume-portfolio-content-template-general.docx')

def replace_cell(cell, text):
    p = cell.paragraphs[0]
    ppr = deepcopy(p._p.pPr) if p._p.pPr is not None else None
    template_rpr = deepcopy(p.runs[0]._r.rPr) if p.runs and p.runs[0]._r.rPr is not None else None
    for child in list(p._p):
        if child.tag != qn('w:pPr'):
            p._p.remove(child)
    if ppr is not None and p._p.pPr is None:
        p._p.insert(0, ppr)
    r = OxmlElement('w:r')
    if template_rpr is not None:
        r.append(template_rpr)
    t = OxmlElement('w:t'); t.set('{http://www.w3.org/XML/1998/namespace}space','preserve'); t.text=str(text)
    r.append(t); p._p.append(r)
    for extra in cell.paragraphs[1:]:
        extra._element.getparent().remove(extra._element)

def configure(row, area, path, hint):
    replace_cell(row.cells[0], area)
    replace_cell(row.cells[1], path)
    replace_cell(row.cells[2], f'[在此填写：{path}]')
    replace_cell(row.cells[3], hint)

def clone_row(table, source_row):
    new_tr = deepcopy(source_row._tr)
    table._tbl.append(new_tr)
    return table.rows[-1]

doc = Document(SOURCE)
# Refresh section titles and instructions while retaining their paragraph/run styles.
headings = {
    '三   Clinical 临床 / 工作': ('三 通用模块一 项目与实践', '先由 Agent 按 CV 归纳 1 个主模块，填 4 个条目。可改为项目经历、客户案例、专业实践、研究或论文；每条尽量包含时间、职责、行动和可核实结果。'),
    '五   Research 研究主题': ('五 通用模块二 作品与专长', '按个人 CV 特色改为个人作品集、核心技能、服务领域、奖项荣誉等。填两项最有辨识度的内容；不适用时可删除整组。'),
    '六   Publication 论文': ('六 通用模块三 精选成果', '选择最能证明个人能力的一项成果，可为项目、作品、奖项、客户成果、论文或其他经历。没有独立成果模块时可并入上方模块。'),
}
for i,p in enumerate(doc.paragraphs[:-1]):
    if p.text in headings:
        title,note=headings[p.text]
        p.text=title
        doc.paragraphs[i+1].text=note

# Table 2 keeps the user's table style and becomes the dense flexible module.
t = doc.tables[2]
configure(t.rows[1], '通用模块一', 'modules[0].type', '模块类型：project / portfolio / award / practice / research / publication')
configure(t.rows[2], '通用模块一', 'modules[0].intro', '用一两句话概括此模块的价值；中英文均可先填一种')
paths = ['date','title','summaryZh','summaryEn','evidence']
hints = ['时间 / 阶段','项目 / 角色名称','背景、职责与关键行动','English summary; translate only supported facts','结果、数据或可核实证据']
row_index=3
for i in range(4):
    for field,hint in zip(paths,hints):
        configure(t.rows[row_index], f'模块一 条目 {i+1}', f'modules[0].items[{i}].{field}', hint)
        row_index += 1

# Research rows become a second, non-academic module with two detailed entries.
t = doc.tables[4]
fields = [
 ('modules[1].type','通用模块二','类型：portfolio / award / skill / research / service / other'),
 ('modules[1].heading','通用模块二','模块名称，例如个人作品集、奖项荣誉、核心专长'),
 ('modules[1].items[0].title','模块二 条目 1','项目 / 作品 / 奖项名称'),
 ('modules[1].items[0].detail','模块二 条目 1','个人贡献、内容说明或获奖依据'),
 ('modules[1].items[1].title','模块二 条目 2','项目 / 作品 / 奖项名称'),
 ('modules[1].items[1].detail','模块二 条目 2','个人贡献、内容说明或获奖依据'),
]
for row, (path,area,hint) in zip(t.rows[1:],fields): configure(row,area,path,hint)

# Publication rows become a flexible featured work record.
t = doc.tables[5]
fields = [
 ('modules[2].type','通用模块三','类型：project / portfolio / award / research / publication / other'),
 ('modules[2].items[0].title','精选成果','成果名称'),
 ('modules[2].items[0].date','精选成果','年份 / 时间'),
 ('modules[2].items[0].detail','精选成果','贡献、影响、出处或链接说明'),
]
for row,(path,area,hint) in zip(t.rows[1:],fields): configure(row,area,path,hint)

# Add phone using the existing Contact row to preserve cell/table formatting.
t = doc.tables[6]
row=clone_row(t,t.rows[-1])
configure(row,'Contact','contact.phone','公开手机号；仅本人同意公开时填写')

# Store the fact that this file is based on the user-edited source layout.
doc.core_properties.title='人物 Portfolio 文案输入表 通用版'
doc.core_properties.subject='基于用户优化版排版的通用人物网站文案输入表'
doc.core_properties.author='Portfolio Template'
doc.save(OUTPUT)
print(f'Created {OUTPUT} from {SOURCE}; kept source unchanged.')

