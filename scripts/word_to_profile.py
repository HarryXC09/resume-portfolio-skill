from __future__ import annotations
import argparse, json, re
from pathlib import Path
from docx import Document

TOKEN = re.compile(r'([A-Za-z_][A-Za-z0-9_]*|\[\d+\])')

def tokens(path: str):
    out=[]
    for part in TOKEN.findall(path):
        out.append(int(part[1:-1]) if part.startswith('[') else part)
    return out

def ensure_list_size(lst, index):
    while len(lst) <= index: lst.append(None)

def set_value(root, path, value):
    parts=tokens(path)
    if not parts: return
    cur=root
    for i,part in enumerate(parts[:-1]):
        nxt=parts[i+1]
        if isinstance(part, int):
            if not isinstance(cur, list): raise TypeError(f'Expected list before {path}')
            ensure_list_size(cur, part)
            if cur[part] is None: cur[part] = [] if isinstance(nxt, int) else {}
            cur=cur[part]
        else:
            if not isinstance(cur, dict): raise TypeError(f'Expected object before {path}')
            if part not in cur or cur[part] is None: cur[part] = [] if isinstance(nxt, int) else {}
            cur=cur[part]
    last=parts[-1]
    if isinstance(last,int):
        if not isinstance(cur,list): raise TypeError(f'Expected list at {path}')
        ensure_list_size(cur,last); cur[last]=value
    else:
        if not isinstance(cur,dict): raise TypeError(f'Expected object at {path}')
        cur[last]=value

def main():
    ap=argparse.ArgumentParser(description='Convert the editable cells in the portfolio Word content template into profile.json.')
    ap.add_argument('docx', type=Path)
    ap.add_argument('--out', type=Path, default=Path('profile.json'))
    args=ap.parse_args()
    doc=Document(args.docx); profile={}; count=0
    for table in doc.tables:
        for row in table.rows[1:]:
            cells=[c.text.strip() for c in row.cells]
            if len(cells)<3: continue
            path, value=cells[1], cells[2]
            if not path or '.' not in path: continue
            set_value(profile,path,value); count+=1
    args.out.write_text(json.dumps(profile,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'Wrote {count} editable fields to {args.out}')

if __name__=='__main__': main()
