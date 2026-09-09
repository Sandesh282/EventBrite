import os
import subprocess
from concurrent.futures import ProcessPoolExecutor

# Paths to process
FOLDERS = [
    "/home/arham/Downloads/Freelance/public/images/events",
    "/home/arham/Downloads/Freelance/public/images" # Also check root for event-related images
]

def convert_single_file(args):
    folder_path, f = args
    base, ext = os.path.splitext(f)
    if ext.lower() not in ('.jpg', '.jpeg', '.png'):
        return None
    
    src = os.path.join(folder_path, f)
    dst = os.path.join(folder_path, f"{base}.webp")
    
    if os.path.exists(dst):
        # Skip if already converted
        if os.path.exists(src) and src != dst:
            try:
                os.remove(src)
            except:
                pass
        return f"Skipped {f} (already exists)"

    try:
        # Using quality 85 for a good balance of size and quality
        subprocess.run(["convert", src, "-quality", "85", dst], check=True)
        if src != dst:
            os.remove(src)
        return f"Converted {f} to {base}.webp"
    except Exception as e:
        return f"Error converting {f}: {e}"

def get_all_files():
    all_tasks = []
    # Specifically target the events folder recursively
    events_folder = "/home/arham/Downloads/Freelance/public/images/events"
    if os.path.exists(events_folder):
        for root, dirs, files in os.walk(events_folder):
            for f in files:
                if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                    all_tasks.append((root, f))
    
    # Also check the root images folder for non-webp files that might be event images
    root_images = "/home/arham/Downloads/Freelance/public/images"
    if os.path.exists(root_images):
        for f in os.listdir(root_images):
            if os.path.isfile(os.path.join(root_images, f)):
                if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                    all_tasks.append((root_images, f))
                    
    return all_tasks

if __name__ == "__main__":
    tasks = get_all_files()
    print(f"Total files to convert: {len(tasks)}")
    
    if not tasks:
        print("No files to convert.")
        exit(0)

    # Use multiple processes to speed up conversion
    with ProcessPoolExecutor(max_workers=os.cpu_count()) as executor:
        results = list(executor.map(convert_single_file, tasks))
    
    for r in results:
        if r and "Error" in r:
            print(r)
    
    print("\nConversion complete.")
