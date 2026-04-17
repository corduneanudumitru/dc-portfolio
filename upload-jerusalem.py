#!/usr/bin/env python3
import os, json, urllib.request, urllib.error, glob, time, subprocess

SANITY_PROJECT_ID = 'x1g6b84l'
SANITY_DATASET = 'production'
SANITY_TOKEN = 'skt9KoERvrM5388fwQ7ucziVXjpOUwvsCRIUr8l22CuAbuUqdJQT5w7ixFQSuoKiDCNbjX2oIfrBaQfY5yvkgYD8oyEgeGczIkWralpK0QW3muNEcjwMXoKfbMZZBgSvtn0prKVTBBCVJlfDvlokCnkejpXmChztdRIwa8w6xyuuz7O7vm7a'

PROJECT_NAME = 'Easter in Jerusalem'
PROJECT_SLUG = 'easter-in-jerusalem'
PROJECT_CATEGORY = 'documentary'
PROJECT_FEATURED = True
COVER_IMAGE_FILENAME = '_DSC2809.jpg'
IMAGE_DIR = os.path.expanduser('~/Pictures/Pastele Ierusalim')
RESULTS_FILE = os.path.expanduser('~/Desktop/dc-portfolio/upload-jerusalem-progress.json')
TEMP_DIR = os.path.expanduser('~/Desktop/dc-portfolio/temp-upload')

MAX_DIMENSION = 3000  # max width or height in pixels
JPEG_QUALITY = 85

def resize_image(filepath):
    """Use sips (macOS built-in) to resize large images before upload."""
    filename = os.path.basename(filepath)
    os.makedirs(TEMP_DIR, exist_ok=True)
    temp_path = os.path.join(TEMP_DIR, filename)

    file_size = os.path.getsize(filepath) / (1024 * 1024)
    if file_size <= 4:
        return filepath  # small enough, no resize needed

    try:
        # Get current dimensions
        result = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', filepath],
                              capture_output=True, text=True)
        lines = result.stdout.strip().split('\n')
        width = int([l for l in lines if 'pixelWidth' in l][0].split(':')[1].strip())
        height = int([l for l in lines if 'pixelHeight' in l][0].split(':')[1].strip())

        if max(width, height) <= MAX_DIMENSION and file_size <= 8:
            return filepath

        # Resize maintaining aspect ratio
        if width > height:
            new_width = min(width, MAX_DIMENSION)
            subprocess.run(['sips', '--resampleWidth', str(new_width), filepath, '--out', temp_path],
                         capture_output=True)
        else:
            new_height = min(height, MAX_DIMENSION)
            subprocess.run(['sips', '--resampleHeight', str(new_height), filepath, '--out', temp_path],
                         capture_output=True)

        new_size = os.path.getsize(temp_path) / (1024 * 1024)
        print(f'  Resized: {file_size:.1f}MB -> {new_size:.1f}MB ({width}x{height} -> {MAX_DIMENSION}px max)')
        return temp_path
    except Exception as e:
        print(f'  Resize failed ({e}), using original')
        return filepath

def upload_image(filepath, retries=3):
    filename = os.path.basename(filepath)

    # Resize if needed
    upload_path = resize_image(filepath)

    with open(upload_path, 'rb') as f:
        image_data = f.read()
    if image_data[:2] != b'\xff\xd8':
        print(f'  SKIP {filename}: not a valid JPEG')
        return None
    size_mb = len(image_data) / (1024 * 1024)
    print(f'  Upload size: {size_mb:.1f}MB')

    url = f'https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/assets/images/{SANITY_DATASET}?filename={filename}'
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, data=image_data, headers={'Content-Type': 'image/jpeg', 'Authorization': f'Bearer {SANITY_TOKEN}'}, method='POST')
            with urllib.request.urlopen(req, timeout=180) as resp:
                result = json.loads(resp.read().decode())
                asset_id = result.get('document', {}).get('_id', 'unknown')
                print(f'  OK -> {asset_id}')
                return result.get('document')
        except Exception as e:
            print(f'  Attempt {attempt+1}/{retries} failed: {e}')
            if attempt < retries - 1:
                wait = (attempt + 1) * 5
                print(f'  Retrying in {wait}s...')
                time.sleep(wait)
    print(f'  FAILED after {retries} attempts')
    return None

def create_project(cover_asset, gallery_assets):
    gallery_images = []
    for asset in gallery_assets:
        gallery_images.append({
            '_type': 'image',
            '_key': asset['_id'][-12:],
            'asset': {'_type': 'reference', '_ref': asset['_id']}
        })
    doc = {
        '_type': 'project',
        'title': PROJECT_NAME,
        'slug': {'_type': 'slug', 'current': PROJECT_SLUG},
        'category': PROJECT_CATEGORY,
        'featured': PROJECT_FEATURED,
        'publishedAt': '2026-03-08T00:00:00Z',
        'coverImage': {'_type': 'image', 'asset': {'_type': 'reference', '_ref': cover_asset['_id']}},
        'gallery': gallery_images,
        'imageCount': len(gallery_assets),
        'description': 'Documentary photography from Easter celebrations in Jerusalem.',
    }
    mutations = {'mutations': [{'create': doc}]}
    body = json.dumps(mutations).encode()
    url = f'https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/{SANITY_DATASET}'
    req = urllib.request.Request(url, data=body, headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {SANITY_TOKEN}'}, method='POST')
    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read().decode())
            print(f'\nProject created successfully!')
            print(f'Result: {json.dumps(result, indent=2)}')
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f'\nFailed to create project: {e.code} {body[:500]}')

def main():
    progress = {}
    if os.path.exists(RESULTS_FILE):
        with open(RESULTS_FILE, 'r') as f:
            progress = json.load(f)
        print(f'Resuming: {len(progress)} images already uploaded\n')

    all_files = sorted(glob.glob(os.path.join(IMAGE_DIR, '*.jpg')) + glob.glob(os.path.join(IMAGE_DIR, '*.jpeg')))
    print(f'Found {len(all_files)} images total')
    print(f'Cover: {COVER_IMAGE_FILENAME}')
    print(f'Project: {PROJECT_NAME} ({PROJECT_CATEGORY}, featured={PROJECT_FEATURED})\n')

    cover_asset = None
    gallery_assets = []

    for i, filepath in enumerate(all_files):
        filename = os.path.basename(filepath)
        if filename in progress:
            print(f'[{i+1}/{len(all_files)}] SKIP {filename} (already uploaded)')
            asset = progress[filename]
            gallery_assets.append(asset)
            if filename == COVER_IMAGE_FILENAME:
                cover_asset = asset
            continue

        print(f'[{i+1}/{len(all_files)}] Uploading {filename}...')
        asset = upload_image(filepath)
        if asset:
            gallery_assets.append(asset)
            if filename == COVER_IMAGE_FILENAME:
                cover_asset = asset
            progress[filename] = asset
            with open(RESULTS_FILE, 'w') as f:
                json.dump(progress, f)
        time.sleep(0.5)

    print(f'\nUploaded {len(gallery_assets)}/{len(all_files)} images')

    if not cover_asset:
        print(f'WARNING: Cover image not found, using first image')
        cover_asset = gallery_assets[0] if gallery_assets else None
    if not cover_asset:
        print('No images uploaded. Aborting.')
        return

    # Clean up temp files
    import shutil
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)

    print(f'\nCreating project document...')
    create_project(cover_asset, gallery_assets)

if __name__ == '__main__':
    main()
