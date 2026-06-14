import zipfile
import xml.etree.ElementTree as ET
import os

def read_docx(file_path):
    if not os.path.exists(file_path):
        return f"File not found: {file_path}"
    
    try:
        with zipfile.ZipFile(file_path) as z:
            xml_content = z.read("word/document.xml")
            
        root = ET.fromstring(xml_content)
        
        # Docx XML namespaces
        ns = {
            'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
        }
        
        paragraphs = []
        for p in root.findall('.//w:p', ns):
            texts = []
            for t in p.findall('.//w:t', ns):
                if t.text:
                    texts.append(t.text)
            if texts:
                paragraphs.append("".join(texts))
        
        return "\n".join(paragraphs)
    except Exception as e:
        return f"Error reading {file_path}: {e}"

# Paths
proposal_path = r"C:\Users\MyBook Hype\Downloads\[Template] Proposal Sayembara Pembuatan Bahan Ajar Digital Jenjang SMK.docx"
storyboard_path = r"C:\Users\MyBook Hype\Downloads\[Template] Storyboard Sayembara Pembuatan Bahan Ajar Digital Jenjang SMK.docx"

print("--- PROPOSAL TEMPLATE ---")
proposal_text = read_docx(proposal_path)
print(proposal_text[:3000]) # Print first 3000 chars

print("\n\n--- STORYBOARD TEMPLATE ---")
storyboard_text = read_docx(storyboard_path)
print(storyboard_text[:3000]) # Print first 3000 chars

# Save to scratch folder for full viewing
os.makedirs(r"c:\Users\MyBook Hype\OneDrive\Documents\AGEN INFODESK 234\GIM\scratch", exist_ok=True)
with open(r"c:\Users\MyBook Hype\OneDrive\Documents\AGEN INFODESK 234\GIM\scratch\proposal_template.txt", "w", encoding="utf-8") as f:
    f.write(proposal_text)
with open(r"c:\Users\MyBook Hype\OneDrive\Documents\AGEN INFODESK 234\GIM\scratch\storyboard_template.txt", "w", encoding="utf-8") as f:
    f.write(storyboard_text)
print("Saved templates to scratch folder.")
