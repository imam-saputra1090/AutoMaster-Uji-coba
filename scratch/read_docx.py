import sys
import docx

sys.stdout.reconfigure(encoding='utf-8')

def inspect_docx(filename):
    print(f"=== {filename} ===")
    try:
        doc = docx.Document(filename)
    except Exception as e:
        print(f"Failed to open {filename}: {e}")
        return
    
    # Check paragraphs
    for i, para in enumerate(doc.paragraphs):
        if any(w in para.text.lower() for w in ["password", "sandi", "nis"]):
            print(f"P[{i}]: {para.text}")
            
    # Check tables
    for t_idx, table in enumerate(doc.tables):
        for r_idx, row in enumerate(table.rows):
            for c_idx, cell in enumerate(row.cells):
                if any(w in cell.text.lower() for w in ["password", "sandi", "nis"]):
                    # Deduplicate printing the same text multiple times because merged cells are returned multiple times
                    print(f"T[{t_idx}] R[{r_idx}] C[{c_idx}]: {cell.text.strip().replace('\n', ' ')}")

inspect_docx("GIM/Storyboard Sayembara Pembuatan Bahan Ajar Digital - AutoMaster.docx")
inspect_docx("GIM/Proposal Sayembara Pembuatan Bahan Ajar Digital - AutoMaster.docx")
inspect_docx("GIM/proposal_sayembara.doc")
inspect_docx("GIM/proposal_dan_storyboard_sayembara.md")
