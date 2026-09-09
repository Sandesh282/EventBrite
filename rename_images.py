import os
import re

BASE = "/home/arham/Downloads/Freelance/public/images/sales-lounge"

for folder in os.listdir(BASE):
    folder_path = os.path.join(BASE, folder)
    if not os.path.isdir(folder_path):
        continue

    files = sorted([f for f in os.listdir(folder_path) if not f.startswith('.')])
    print(f"\n--- {folder} ({len(files)} files) ---")

    for i, fname in enumerate(files, start=1):
        ext = fname.rsplit('.', 1)[-1].upper()
        if ext in ('JPG', 'JPEG'):
            ext = 'JPG'
        elif ext in ('PNG',):
            ext = 'PNG'
        elif ext in ('WEBP',):
            ext = 'WEBP'
        else:
            ext = fname.rsplit('.', 1)[-1]

        new_name = f"{i}.{ext}"
        src = os.path.join(folder_path, fname)
        dst = os.path.join(folder_path, new_name)

        if src != dst:
            os.rename(src, dst)
            print(f"  {fname} → {new_name}")
        else:
            print(f"  {fname} (already named correctly)")
