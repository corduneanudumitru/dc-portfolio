#!/usr/bin/env python3
"""
Batch upload script:
  1. Travel → new featured project
  2. Patagonia → new featured project
  3. Petra,Jordan → new featured project (titled "Petra Jordan")
  4. edit bhutan old people → add images to existing Bhutan project

⚠ NEVER modifies original files — uses temp copies for any resizing.
Run on your Mac: python3 ~/Desktop/dc-portfolio/upload_batch.py
"""

import os
import json
import subprocess
import urllib.request
import urllib.error
import time
import socket
import shutil
import tempfile

# === CONFIG ===
SANITY_PROJECT_ID = "x1g6b84l"
SANITY_DATASET = "production"
SANITY_TOKEN = "skt9KoERvrM5388fwQ7ucziVXjpOUwvsCRIUr8l22CuAbuUqdJQT5w7ixFQSuoKiDCNbjX2oIfrBaQfY5yvkgYD8oyEgeGczIkWralpK0QW3muNEcjwMXoKfbMZZBgSvtn0prKVTBBCVJlfDvlokCnkejpXmChztdRIwa8w6xyuuz7O7vm7a"

PICTURES = os.path.expanduser("~/Pictures")

# 3 new projects: (folder_name, project_title, slug, category, cover_pattern, location)
NEW_PROJECTS = [
    {
        "folder": os.path.join(PICTURES, "Travel"),
        "title": "Travel",
        "slug": "travel",
        "category": "travel",
        "cover_pattern": "7223",
        "location": "",
        "featured": True,
    },
    {
        "folder": os.path.join(PICTURES, "Patagonia"),
        "title": "Patagonia",
        "slug": "patagonia",
        "category": "travel",
        "cover_pattern": "5707",
        "location": "Patagonia, Argentina",
        "featured": True,
    },
    {
        "folder": os.path.join(PICTURES, "Petra,Jordan"),
        "title": "Petra Jordan",
        "slug": "petra-jordan",
        "category": "travel",
        "cover_pattern": "3261",
        "location": "Petra, Jordan",
        "featured": True,
    },
]

# Bhutan update
BHUTAN_FOLDER = os.path.join(PICTURES, "edit bhutan old people")
BHUTAN_SLUG = "bhutan"

# Sanity allows up to 12MB per image — only resize temp copies if over
MAX_UPLOAD_BYTES = 12 * 1024 * 1024
MAX_RETRIES = 3
UPLOAD_TIMEOUT = 180

# === HELPERS ===

def human_size(nbytes):
    for unit in ['B', 'KB', 'MB', 'GB']:
        if nbytes < 1024:
            return f"{nbytes:.1f}{unit}"
        nbytes /= 1024
    return f"{nbytes:.1f}TB"

def get_jpg_files(folder):
    """Get sorted list of JPG/JPEG files in folder."""
    return sorted([
        f for f in os.listdir(folder)
        if f.upper().endswith(('.JPG', '.JPEG'))
    ])

def find_cover(files, pattern):
    """Find file matching cover pattern."""
    matches = [f for f in files if pattern in f]
    if matches:
        return matches[0]
    print(f"  ⚠ No file matching pattern '{pattern}' found!")
    return files[0] if files else None

def prepare_for_upload(src_path, tmp_dir):
    """
    Copy to temp dir. Resize ONLY the temp copy if over 12MB.
    NEVER touches the original.
    """
    filename = os.path.basename(src_path)
    tmp_path = os.path.join(tmp_dir, filename)
    shutil.copy2(src_path, tmp_path)

    size = os.path.getsize(tmp_path)
    if size <= MAX_UPLOAD_BYTES:
        return tmp_path

    # Resize temp copy only
    print(f"    Resizing temp copy of {filename} ({human_size(size)}) -> max 4000px...")
    subprocess.run(["sips", "--resampleHeightWidthMax", "4000", tmp_path], capture_output=True)

    size = os.path.getsize(tmp_path)
    if size <= MAX_UPLOAD_BYTES:
        print(f"    -> {human_size(size)} ✓")
        return tmp_path

    print(f"    Still {human_size(size)}, trying 3000px...")
    subprocess.run(["sips", "--resampleHeightWidthMax", "3000", tmp_path], capture_output=True)
    size = os.path.getsize(tmp_path)
    print(f"    -> {human_size(size)}")
    return tmp_path

def upload_image(filepath):
    """Upload image to Sanity with retry logic."""
    filename = os.path.basename(filepath)
    size = os.path.getsize(filepath)

    with open(filepath, "rb") as f:
        data = f.read()

    safe_filename = urllib.request.quote(filename)
    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/assets/images/{SANITY_DATASET}?filename={safe_filename}"

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            req = urllib.request.Request(url, data=data, method="POST")
            req.add_header("Authorization", f"Bearer {SANITY_TOKEN}")
            req.add_header("Content-Type", "image/jpeg")

            with urllib.request.urlopen(req, timeout=UPLOAD_TIMEOUT) as resp:
                result = json.loads(resp.read().decode())
                asset_id = result["document"]["_id"]
                print(f"    ✓ ({human_size(size)}) {filename}")
                return asset_id

        except urllib.error.HTTPError as e:
            error_body = e.read().decode()
            print(f"    ✗ HTTP {e.code} attempt {attempt}/{MAX_RETRIES}: {error_body[:150]}")
            if attempt < MAX_RETRIES:
                time.sleep(attempt * 3)
        except (urllib.error.URLError, socket.timeout, ConnectionError) as e:
            print(f"    ✗ Network error attempt {attempt}/{MAX_RETRIES}: {e}")
            if attempt < MAX_RETRIES:
                time.sleep(attempt * 5)

    print(f"    ✗ FAILED: {filename}")
    return None

def sanity_query(query):
    """Run a GROQ query against Sanity."""
    encoded = urllib.request.quote(query)
    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/{SANITY_DATASET}?query={encoded}"
    req = urllib.request.Request(url)
    req.add_header("Authorization", f"Bearer {SANITY_TOKEN}")
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode()).get("result")

def sanity_mutate(mutations):
    """Run mutations against Sanity."""
    data = json.dumps({"mutations": mutations}).encode()
    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/{SANITY_DATASET}"

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            req = urllib.request.Request(url, data=data, method="POST")
            req.add_header("Authorization", f"Bearer {SANITY_TOKEN}")
            req.add_header("Content-Type", "application/json")
            with urllib.request.urlopen(req, timeout=60) as resp:
                return json.loads(resp.read().decode())
        except Exception as e:
            print(f"    ✗ Mutation attempt {attempt}/{MAX_RETRIES}: {e}")
            if attempt < MAX_RETRIES:
                time.sleep(attempt * 3)
    return None

def verify_originals(folder, files, original_sizes):
    """Verify original files were NOT modified."""
    for f in files:
        current = os.path.getsize(os.path.join(folder, f))
        if current != original_sizes[f]:
            print(f"  ⚠ SAFETY FAIL: {f} was modified! Aborting.")
            return False
    print(f"  ✓ All {len(files)} originals verified untouched.")
    return True

def upload_folder(folder, files, tmp_dir):
    """Prepare and upload all files from a folder. Returns {filename: asset_id}."""
    original_sizes = {f: os.path.getsize(os.path.join(folder, f)) for f in files}
    total = sum(original_sizes.values())
    print(f"  Files: {len(files)} | Total: {human_size(total)}")

    # Prepare temp copies
    print(f"  Preparing temp copies (resizing only if >12MB)...")
    upload_paths = {}
    for f in files:
        src = os.path.join(folder, f)
        upload_paths[f] = prepare_for_upload(src, tmp_dir)

    # Verify originals untouched
    if not verify_originals(folder, files, original_sizes):
        return None

    # Upload
    print(f"  Uploading {len(files)} images...")
    asset_map = {}
    for i, f in enumerate(files):
        print(f"  [{i+1}/{len(files)}] {f}")
        asset_id = upload_image(upload_paths[f])
        if asset_id:
            asset_map[f] = asset_id
        time.sleep(0.5)

    print(f"  Uploaded: {len(asset_map)}/{len(files)}")
    return asset_map

def create_project(title, slug, category, location, cover_asset_id, gallery_asset_ids, featured):
    """Create a new project document in Sanity."""
    gallery = []
    for i, asset_id in enumerate(gallery_asset_ids):
        gallery.append({
            "_type": "image",
            "_key": f"img{i:03d}",
            "asset": {"_type": "reference", "_ref": asset_id}
        })

    doc = {
        "_type": "project",
        "title": title,
        "slug": {"_type": "slug", "current": slug},
        "category": category,
        "coverImage": {
            "_type": "image",
            "asset": {"_type": "reference", "_ref": cover_asset_id}
        },
        "gallery": gallery,
        "imageCount": len(gallery_asset_ids),
        "featured": featured,
        "publishedAt": time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime()),
    }
    if location:
        doc["location"] = location

    result = sanity_mutate([{"create": doc}])
    if result:
        print(f"  ✓ Project '{title}' created! (featured={featured})")
        return True
    print(f"  ✗ Failed to create project '{title}'")
    return False

def delete_existing_project(slug):
    """Delete existing project by slug if it exists."""
    docs = sanity_query(f'*[_type == "project" && slug.current == "{slug}"]{{_id}}')
    if not docs:
        return
    print(f"  Deleting existing project with slug '{slug}'...")
    mutations = []
    for doc in docs:
        mutations.append({"delete": {"id": doc["_id"]}})
        if not doc["_id"].startswith("drafts."):
            mutations.append({"delete": {"id": f"drafts.{doc['_id']}"}})
    sanity_mutate(mutations)
    print(f"  ✓ Deleted.")

def add_images_to_project(slug, new_asset_ids):
    """Append images to an existing project's gallery."""
    project = sanity_query(f'*[_type == "project" && slug.current == "{slug}"][0]{{_id, "galleryCount": count(gallery)}}')
    if not project:
        print(f"  ✗ Project with slug '{slug}' not found!")
        return False

    project_id = project["_id"]
    existing_count = project.get("galleryCount", 0)
    print(f"  Found project {project_id} with {existing_count} existing gallery images.")

    # Build new gallery items with unique keys
    new_items = []
    for i, asset_id in enumerate(new_asset_ids):
        new_items.append({
            "_type": "image",
            "_key": f"add{existing_count + i:03d}",
            "asset": {"_type": "reference", "_ref": asset_id}
        })

    # Ensure gallery array exists, then append new items
    mutations = [
        {
            "patch": {
                "id": project_id,
                "setIfMissing": {"gallery": []}
            }
        },
        {
            "patch": {
                "id": project_id,
                "insert": {
                    "after": "gallery[-1]",
                    "items": new_items
                }
            }
        },
        {
            "patch": {
                "id": project_id,
                "set": {
                    "imageCount": existing_count + len(new_asset_ids)
                }
            }
        }
    ]

    result = sanity_mutate(mutations)
    if result:
        print(f"  ✓ Added {len(new_asset_ids)} images to '{slug}' (now {existing_count + len(new_asset_ids)} total)")
        return True
    print(f"  ✗ Failed to update project '{slug}'")
    return False


# === MAIN ===

def main():
    print("=" * 60)
    print("  BATCH UPLOAD — 3 new projects + Bhutan update")
    print("  ⚠ Original files will NOT be modified")
    print("=" * 60)

    # Create a single temp directory for the entire batch
    tmp_dir = tempfile.mkdtemp(prefix="batch_upload_")
    print(f"\nTemp directory: {tmp_dir}\n")

    success_count = 0
    total_tasks = 4

    # ─── TASK 1-3: New Projects ───
    for proj in NEW_PROJECTS:
        folder = proj["folder"]
        title = proj["title"]
        slug = proj["slug"]
        print(f"\n{'─'*60}")
        print(f"  PROJECT: {title}")
        print(f"  Folder: {folder}")
        print(f"{'─'*60}")

        if not os.path.isdir(folder):
            print(f"  ✗ Folder not found: {folder}")
            continue

        files = get_jpg_files(folder)
        if not files:
            print(f"  ✗ No JPG files found!")
            continue

        cover_file = find_cover(files, proj["cover_pattern"])
        print(f"  Cover: {cover_file}")

        # Delete existing project with same slug (if any)
        delete_existing_project(slug)

        # Upload
        asset_map = upload_folder(folder, files, tmp_dir)
        if not asset_map:
            continue

        if cover_file not in asset_map:
            print(f"  ✗ Cover image failed to upload!")
            continue

        # Create project
        cover_asset_id = asset_map[cover_file]
        gallery_ids = [asset_map[f] for f in files if f in asset_map]
        if create_project(title, slug, proj["category"], proj["location"],
                         cover_asset_id, gallery_ids, proj["featured"]):
            success_count += 1

    # ─── TASK 4: Add to Bhutan ───
    print(f"\n{'─'*60}")
    print(f"  UPDATE: Adding images to Bhutan project")
    print(f"  Folder: {BHUTAN_FOLDER}")
    print(f"{'─'*60}")

    if os.path.isdir(BHUTAN_FOLDER):
        bhutan_files = get_jpg_files(BHUTAN_FOLDER)
        if bhutan_files:
            asset_map = upload_folder(BHUTAN_FOLDER, bhutan_files, tmp_dir)
            if asset_map:
                new_ids = [asset_map[f] for f in bhutan_files if f in asset_map]
                if add_images_to_project(BHUTAN_SLUG, new_ids):
                    success_count += 1
        else:
            print("  ✗ No JPG files found!")
    else:
        print(f"  ✗ Folder not found: {BHUTAN_FOLDER}")

    # ─── Cleanup ───
    shutil.rmtree(tmp_dir)
    print(f"\n✓ Temp files cleaned up.")

    print(f"\n{'='*60}")
    print(f"  Completed: {success_count}/{total_tasks} tasks")
    print(f"  Verify at: https://dc-portfolio-roan.vercel.app/work")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
