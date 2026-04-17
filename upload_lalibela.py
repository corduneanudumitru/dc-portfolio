#!/usr/bin/env python3
"""
Upload script for: Easter in Lalibela, Ethiopia
- NEVER modifies original files (uses temp copies for resizing)
- Deletes old Lalibela project first, then creates fresh
- Sets featured = true so it shows on homepage
Run on your Mac: python3 ~/Desktop/dc-portfolio/upload_lalibela.py
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

FOLDER = os.path.expanduser("~/Pictures/Pastele Lalibela, Ethiopia")
PROJECT_TITLE = "Easter in Lalibela, Ethiopia"
PROJECT_SLUG = "easter-in-lalibela-ethiopia"
PROJECT_CATEGORY = "documentary"
COVER_IMAGE_NAME = "DSC09318 3.JPG"

# Sanity allows up to 12MB per image asset — only resize if over 12MB
MAX_UPLOAD_BYTES = 12 * 1024 * 1024
MAX_RETRIES = 3
UPLOAD_TIMEOUT = 180  # 3 minutes per file

# === HELPERS ===

def human_size(nbytes):
    for unit in ['B', 'KB', 'MB', 'GB']:
        if nbytes < 1024:
            return f"{nbytes:.1f}{unit}"
        nbytes /= 1024
    return f"{nbytes:.1f}TB"

def prepare_for_upload(src_path, tmp_dir):
    """
    Copy file to temp dir. Resize the COPY if over 12MB.
    NEVER touches the original.
    Returns path to the file ready for upload.
    """
    filename = os.path.basename(src_path)
    tmp_path = os.path.join(tmp_dir, filename)
    shutil.copy2(src_path, tmp_path)

    size = os.path.getsize(tmp_path)
    if size <= MAX_UPLOAD_BYTES:
        return tmp_path

    # Resize the TEMP COPY only
    print(f"  File is {human_size(size)}, resizing temp copy to max 4000px...")
    subprocess.run(
        ["sips", "--resampleHeightWidthMax", "4000", tmp_path],
        capture_output=True
    )

    size = os.path.getsize(tmp_path)
    if size <= MAX_UPLOAD_BYTES:
        print(f"  -> {human_size(size)} ✓")
        return tmp_path

    # Still too big — try 3000px
    print(f"  Still {human_size(size)}, resizing to max 3000px...")
    subprocess.run(
        ["sips", "--resampleHeightWidthMax", "3000", tmp_path],
        capture_output=True
    )
    size = os.path.getsize(tmp_path)
    print(f"  -> {human_size(size)}")
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
                print(f"  ✓ Uploaded ({human_size(size)}): {filename}")
                return asset_id

        except urllib.error.HTTPError as e:
            error_body = e.read().decode()
            print(f"  ✗ HTTP {e.code} on attempt {attempt}/{MAX_RETRIES}: {error_body[:200]}")
            if attempt < MAX_RETRIES:
                wait = attempt * 3
                print(f"    Retrying in {wait}s...")
                time.sleep(wait)

        except (urllib.error.URLError, socket.timeout, ConnectionError) as e:
            print(f"  ✗ Network error on attempt {attempt}/{MAX_RETRIES}: {e}")
            if attempt < MAX_RETRIES:
                wait = attempt * 5
                print(f"    Retrying in {wait}s...")
                time.sleep(wait)

    print(f"  ✗ FAILED after {MAX_RETRIES} attempts: {filename}")
    return None

def delete_old_project():
    """Find and delete existing Lalibela project (both draft and published)."""
    print("--- Checking for existing Lalibela project ---")

    # Query for existing project by slug
    query = urllib.request.quote(f'*[_type == "project" && slug.current == "{PROJECT_SLUG}"]{{_id}}')
    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/{SANITY_DATASET}?query={query}"

    req = urllib.request.Request(url)
    req.add_header("Authorization", f"Bearer {SANITY_TOKEN}")

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode())
            docs = result.get("result", [])

            if not docs:
                print("  No existing project found, proceeding fresh.")
                return

            print(f"  Found {len(docs)} existing document(s), deleting...")

            # Delete each document (published + draft versions)
            mutations = []
            for doc in docs:
                doc_id = doc["_id"]
                mutations.append({"delete": {"id": doc_id}})
                # Also delete the draft version
                if not doc_id.startswith("drafts."):
                    mutations.append({"delete": {"id": f"drafts.{doc_id}"}})

            data = json.dumps({"mutations": mutations}).encode()
            mut_url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/{SANITY_DATASET}"

            req2 = urllib.request.Request(mut_url, data=data, method="POST")
            req2.add_header("Authorization", f"Bearer {SANITY_TOKEN}")
            req2.add_header("Content-Type", "application/json")

            with urllib.request.urlopen(req2, timeout=30) as resp2:
                json.loads(resp2.read().decode())
                print("  ✓ Old project deleted.")

    except Exception as e:
        print(f"  Warning: Could not check/delete old project: {e}")
        print("  Continuing anyway (may create duplicate)...")

def create_project(cover_asset_id, gallery_asset_ids, image_count):
    """Create project document with featured = true."""
    gallery = []
    for i, asset_id in enumerate(gallery_asset_ids):
        gallery.append({
            "_type": "image",
            "_key": f"img{i:03d}",
            "asset": {
                "_type": "reference",
                "_ref": asset_id
            }
        })

    doc = {
        "_type": "project",
        "title": PROJECT_TITLE,
        "slug": {"_type": "slug", "current": PROJECT_SLUG},
        "category": PROJECT_CATEGORY,
        "coverImage": {
            "_type": "image",
            "asset": {
                "_type": "reference",
                "_ref": cover_asset_id
            }
        },
        "gallery": gallery,
        "imageCount": image_count,
        "location": "Lalibela, Ethiopia",
        "featured": True,
        "publishedAt": time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime()),
    }

    mutations = {"mutations": [{"create": doc}]}
    data = json.dumps(mutations).encode()

    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/{SANITY_DATASET}"

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            req = urllib.request.Request(url, data=data, method="POST")
            req.add_header("Authorization", f"Bearer {SANITY_TOKEN}")
            req.add_header("Content-Type", "application/json")

            with urllib.request.urlopen(req, timeout=60) as resp:
                result = json.loads(resp.read().decode())
                print(f"\n✓ Project created successfully! (featured = true)")
                print(f"  Result: {json.dumps(result, indent=2)}")
                return True

        except (urllib.error.HTTPError, urllib.error.URLError, socket.timeout) as e:
            print(f"  ✗ Attempt {attempt}/{MAX_RETRIES} failed: {e}")
            if attempt < MAX_RETRIES:
                time.sleep(attempt * 3)

    print(f"\n✗ FAILED to create project after {MAX_RETRIES} attempts")
    return False

# === MAIN ===

def main():
    print(f"{'='*50}")
    print(f"  Uploading: {PROJECT_TITLE}")
    print(f"  From: {FOLDER}")
    print(f"  ⚠ Original files will NOT be modified")
    print(f"{'='*50}\n")

    if not os.path.isdir(FOLDER):
        print(f"ERROR: Folder not found: {FOLDER}")
        return

    # Get all JPGs
    all_files = sorted([f for f in os.listdir(FOLDER) if f.upper().endswith(('.JPG', '.JPEG'))])

    if not all_files:
        print("ERROR: No JPG files found in folder!")
        return

    # Show file size summary
    sizes = {f: os.path.getsize(os.path.join(FOLDER, f)) for f in all_files}
    total_size = sum(sizes.values())
    biggest_name = max(sizes, key=sizes.get)
    biggest_size = sizes[biggest_name]

    print(f"Images found: {len(all_files)}")
    print(f"Total size: {human_size(total_size)}")
    print(f"Biggest file: {biggest_name} ({human_size(biggest_size)})")
    print(f"Cover image: {COVER_IMAGE_NAME}")
    print()

    if COVER_IMAGE_NAME not in all_files:
        print(f"ERROR: Cover image '{COVER_IMAGE_NAME}' not found!")
        print(f"Available files:\n  " + "\n  ".join(all_files[:10]))
        return

    # Phase 0: Delete old project
    delete_old_project()

    # Phase 1: Prepare temp copies (resize only temp copies if needed)
    tmp_dir = tempfile.mkdtemp(prefix="lalibela_upload_")
    print(f"\n--- Phase 1: Preparing images (temp dir: {tmp_dir}) ---")
    print(f"  Only files over {human_size(MAX_UPLOAD_BYTES)} will be resized (as temp copies).")

    upload_paths = {}  # filename -> tmp path ready for upload
    for f in all_files:
        src = os.path.join(FOLDER, f)
        tmp_path = prepare_for_upload(src, tmp_dir)
        upload_paths[f] = tmp_path

    # Verify originals are untouched
    for f in all_files:
        orig_size = os.path.getsize(os.path.join(FOLDER, f))
        if orig_size != sizes[f]:
            print(f"  ⚠ SAFETY CHECK FAILED: {f} was modified! Aborting.")
            shutil.rmtree(tmp_dir)
            return
    print("  ✓ All originals verified untouched.")

    # Phase 2: Upload all images
    print(f"\n--- Phase 2: Uploading {len(all_files)} images ---")
    asset_map = {}
    failed = []

    for i, f in enumerate(all_files):
        print(f"[{i+1}/{len(all_files)}] {f}")
        asset_id = upload_image(upload_paths[f])
        if asset_id:
            asset_map[f] = asset_id
        else:
            failed.append(f)
        time.sleep(0.5)

    print(f"\n--- Upload Summary ---")
    print(f"Successful: {len(asset_map)}/{len(all_files)}")
    if failed:
        print(f"Failed: {len(failed)} — {', '.join(failed)}")

    if COVER_IMAGE_NAME not in asset_map:
        print("\nERROR: Cover image failed to upload. Aborting project creation.")
        shutil.rmtree(tmp_dir)
        return

    if len(asset_map) < len(all_files):
        print(f"\nWARNING: {len(failed)} image(s) failed.")
        answer = input("Proceed with creating the project? (y/n): ").strip().lower()
        if answer != 'y':
            print("Aborted.")
            shutil.rmtree(tmp_dir)
            return

    # Phase 3: Create project document (featured = true)
    cover_asset_id = asset_map[COVER_IMAGE_NAME]
    gallery_asset_ids = [asset_map[f] for f in all_files if f in asset_map]

    print(f"\n--- Phase 3: Creating project document ---")
    print(f"  Gallery images: {len(gallery_asset_ids)}")
    print(f"  Featured: YES")
    create_project(cover_asset_id, gallery_asset_ids, len(gallery_asset_ids))

    # Cleanup temp dir
    shutil.rmtree(tmp_dir)
    print(f"\n✓ Temp files cleaned up.")

    print(f"\n{'='*50}")
    print(f"  Done! Verify at: https://dc-portfolio-roan.vercel.app/studio")
    print(f"  Project should appear on homepage (featured).")
    print(f"{'='*50}")

if __name__ == "__main__":
    main()
