import docx
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

def parse_docx_tables(file_path):
    if not os.path.exists(file_path):
        return f"File not found: {file_path}"
    
    try:
        doc = docx.Document(file_path)
        output = []
        for i, table in enumerate(doc.tables):
            output.append(f"\n--- TABLE {i+1} ---")
            for row in table.rows:
                row_data = [cell.text.strip().replace('\n', ' ') for cell in row.cells]
                # De-duplicate adjacent identical cells (due to merged cells)
                unique_row = []
                for val in row_data:
                    if not unique_row or unique_row[-1] != val:
                        unique_row.append(val)
                output.append(" | ".join(unique_row))
        return "\n".join(output)
    except Exception as e:
        return f"Error parsing tables from {file_path}: {e}"

# Try using python-docx (which might not be installed, let's see if it is)
# If python-docx is not installed, we will catch the ImportError.
try:
    import docx
    proposal_path = r"C:\Users\MyBook Hype\Downloads\[Template] Proposal Sayembara Pembuatan Bahan Ajar Digital Jenjang SMK.docx"
    storyboard_path = r"C:\Users\MyBook Hype\Downloads\[Template] Storyboard Sayembara Pembuatan Bahan Ajar Digital Jenjang SMK.docx"
    
    print("PROPOSAL TABLES:")
    print(parse_docx_tables(proposal_path))
    
    print("\nSTORYBOARD TABLES:")
    print(parse_docx_tables(storyboard_path))
except ImportError:
    print("python-docx is not installed. Let's install it or use xml parsing.")
