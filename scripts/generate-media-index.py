#!/usr/bin/env python3
import os
import json
import io

# Configuration
PUBLIC_DIR = "public"
OUTPUT_DIR = "public/_media"
MEDIA_TYPES = {
    "images": {
        "extensions": {".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"},
        "type": "image"
    },
    "videos": {
        "extensions": {".mp4", ".webm", ".mov"},
        "type": "video"
    }
}

def generate_index(category, config):
    base_dir = os.path.join(PUBLIC_DIR, category)
    valid_extensions = config["extensions"]
    media_type = config["type"]
    items = []

    if not os.path.exists(base_dir):
        print(f"Directory not found: {base_dir}. Skipping.")
        return None

    has_files = False
    # Walk directory
    for root, _, files in os.walk(base_dir):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in valid_extensions:
                has_files = True
                # Calculate relative path from public/{category}
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, base_dir)
                
                # Normalize path separators to forward slash
                rel_path = rel_path.replace(os.path.sep, "/")
                
                # Remove leading slash if present (os.path.relpath usually doesn't add one, but for safety)
                rel_path = rel_path.lstrip("/")
                
                items.append({
                    "path": rel_path,
                    "ext": ext.lstrip("."),
                    "type": media_type
                })
    
    if not has_files:
        print(f"No files found in {base_dir}. Skipping generation to preserve existing index if any.")
        return None


    # Sort lexicographically by path
    items.sort(key=lambda x: x["path"])
    return items

def main():
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for category, config in MEDIA_TYPES.items():
        print(f"Scanning {category}...")
        items = generate_index(category, config)
        
        if items is None:
            continue

        output_file = os.path.join(OUTPUT_DIR, f"{category}.json")
        
        # Write JSON with deterministic formatting
        with io.open(output_file, "w", encoding="utf-8") as f:
            json.dump(items, f, indent=2, ensure_ascii=False)
            f.write('\n') # Add trailing newline
            
        print(f"Generated {output_file} with {len(items)} items")

if __name__ == "__main__":
    main()
