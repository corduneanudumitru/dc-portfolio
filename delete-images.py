#!/usr/bin/env python3
import json, urllib.request, urllib.error

SANITY_PROJECT_ID = 'x1g6b84l'
SANITY_DATASET = 'production'
SANITY_TOKEN = 'skt9KoERvrM5388fwQ7ucziVXjpOUwvsCRIUr8l22CuAbuUqdJQT5w7ixFQSuoKiDCNbjX2oIfrBaQfY5yvkgYD8oyEgeGczIkWralpK0QW3muNEcjwMXoKfbMZZBgSvtn0prKVTBBCVJlfDvlokCnkejpXmChztdRIwa8w6xyuuz7O7vm7a'

# Files to remove (partial filename matches)
REMOVE_FILES = ['_DSC2611', '_DSC2653', '_DSC2681', '_DSC2617-2', '_DSC2231-Enhanced-NR']

def sanity_query(query):
    encoded = urllib.parse.quote(query)
    url = f'https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/{SANITY_DATASET}?query={encoded}'
    req = urllib.request.Request(url, headers={'Authorization': f'Bearer {SANITY_TOKEN}'})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def sanity_mutate(mutations):
    body = json.dumps({'mutations': mutations}).encode()
    url = f'https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/{SANITY_DATASET}'
    req = urllib.request.Request(url, data=body, headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {SANITY_TOKEN}'
    }, method='POST')
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

# 1. Get the Easter in Jerusalem project
print('Fetching project...')
result = sanity_query('*[_type == "project" && slug.current == "easter-in-jerusalem"][0]{_id, title, gallery[]{_key, asset->{_id, originalFilename}}}')
project = result.get('result')
if not project:
    print('Project not found!')
    exit(1)

project_id = project['_id']
print(f'Found: {project["title"]} ({project_id})')
print(f'Gallery has {len(project.get("gallery", []))} images\n')

# 2. Find images to remove
keys_to_remove = []
for img in project.get('gallery', []):
    asset = img.get('asset', {})
    filename = asset.get('originalFilename', '')
    for pattern in REMOVE_FILES:
        if pattern in filename:
            print(f'  REMOVE: {filename} (key: {img["_key"]})')
            keys_to_remove.append(img['_key'])
            break

if not keys_to_remove:
    print('No matching images found to remove.')
    exit(0)

print(f'\nRemoving {len(keys_to_remove)} images...')

# 3. Unset each image from the gallery by key
mutations = []
for key in keys_to_remove:
    mutations.append({
        'patch': {
            'id': project_id,
            'unset': [f'gallery[_key=="{key}"]']
        }
    })

# Also update image count
new_count = len(project.get('gallery', [])) - len(keys_to_remove)
mutations.append({
    'patch': {
        'id': project_id,
        'set': {'imageCount': new_count}
    }
})

result = sanity_mutate(mutations)
print(f'Done! Removed {len(keys_to_remove)} images. Gallery now has {new_count} images.')
print(f'Result: {json.dumps(result, indent=2)}')
