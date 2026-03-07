#!/usr/bin/env python3
import urllib.request, urllib.parse, json, re, time, sys

SANITY_PROJECT_ID = 'x1g6b84l'
SANITY_DATASET = 'production'
SANITY_TOKEN = 'skt9KoERvrM5388fwQ7ucziVXjpOUwvsCRIUr8l22CuAbuUqdJQT5w7ixFQSuoKiDCNbjX2oIfrBaQfY5yvkgYD8oyEgeGczIkWralpK0QW3muNEcjwMXoKfbMZZBgSvtn0prKVTBBCVJlfDvlokCnkejpXmChztdRIwa8w6xyuuz7O7vm7a'
PROJECTS = [
    {'name': 'Rural Ethiopia', 'slug': 'rural-ethiopia', 'url': 'https://dumitrucorduneanu.myportfolio.com/markets', 'category': 'documentary', 'location': 'Ethiopia'},
    {'name': 'Afar', 'slug': 'afar', 'url': 'https://dumitrucorduneanu.myportfolio.com/afar', 'category': 'documentary', 'location': 'Ethiopia'},
    {'name': 'Mursi', 'slug': 'mursi', 'url': 'https://dumitrucorduneanu.myportfolio.com/mursi', 'category': 'documentary', 'location': 'Ethiopia'},
    {'name': 'Christian Ethiopia', 'slug': 'christian-ethiopia', 'url': 'https://dumitrucorduneanu.myportfolio.com/amboseli', 'category': 'documentary', 'location': 'Ethiopia'},
    {'name': 'Tribal Ethiopia', 'slug': 'tribal-ethiopia', 'url': 'https://dumitrucorduneanu.myportfolio.com/omo-valley-tribes', 'category': 'documentary', 'location': 'Ethiopia'},
    {'name': 'Bhutan', 'slug': 'bhutan', 'url': 'https://dumitrucorduneanu.myportfolio.com/bhutan', 'category': 'travel', 'location': 'Bhutan'},
]

def log(msg, level='INFO'):
    t = time.strftime('%H:%M:%S')
    print(f'[{t}] [{level:>4}] {msg}', flush=True)

def scrape_images(project_url):
    req = urllib.request.Request(project_url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req, timeout=30).read().decode()
    all_urls = re.findall(r'https://cdn[.]myportfolio[.]com/[^\s"<>]+', html)
    image_map = {}
    for url in all_urls:
        if any(s in url for s in ['.css', '_rwc_', '_carw_', 'favicon']):
            continue
        if not re.search(r'[.](jpg|jpeg|png|webp)', url, re.I):
            continue
        uuids = re.findall(r'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}', url, re.I)
        if len(uuids) < 2:
            continue
        uuid = uuids[1]
        rm = re.search(r'_rw_(\d+)', url)
        res = int(rm.group(1)) if rm else 0
        if uuid not in image_map or res > image_map[uuid][1]:
            image_map[uuid] = (url, res)
    return [(u, info[0]) for u, info in image_map.items()]

def download_image(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Referer': 'https://dumitrucorduneanu.myportfolio.com/'})
    return urllib.request.urlopen(req, timeout=60).read()

def upload_to_sanity(image_data, filename):
    url = f'https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/assets/images/{SANITY_DATASET}?filename={urllib.parse.quote(filename)}'
    req = urllib.request.Request(url, data=image_data, headers={'Content-Type': 'image/jpeg', 'Authorization': f'Bearer {SANITY_TOKEN}'}, method='POST')
    resp = urllib.request.urlopen(req, timeout=120)
    return json.loads(resp.read().decode())['document']

def sanity_mutate(mutations):
    url = f'https://{SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/{SANITY_DATASET}'
    body = json.dumps({'mutations': mutations}).encode()
    req = urllib.request.Request(url, data=body, headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {SANITY_TOKEN}'}, method='POST')
    resp = urllib.request.urlopen(req, timeout=30)
    return json.loads(resp.read().decode())

def create_project_doc(project, assets):
    gallery = [{'_type': 'image', '_key': f'img-{i}', 'asset': {'_type': 'reference', '_ref': a['_id']}} for i, a in enumerate(assets)]
    doc = {
        '_type': 'project',
        'title': project['name'],
        'slug': {'_type': 'slug', 'current': project['slug']},
        'category': project['category'],
        'location': project['location'],
        'coverImage': {'_type': 'image', 'asset': {'_type': 'reference', '_ref': assets[0]['_id']}},
        'gallery': gallery,
        'featured': True,
        'publishedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    }
    result = sanity_mutate([{'create': doc}])
    res = result.get('results', [{}])[0]
    return res.get('id', res.get('documentId', 'unknown'))

def main():
    log(f'Starting upload: {len(PROJECTS)} projects')
    ok_list, fail_list, total = [], [], 0
    for project in PROJECTS:
        log(f'')
        log(f'{"="*50}')
        log(f'PROJECT: {project["name"]}')
        log(f'{"="*50}')
        try:
            images = scrape_images(project['url'])
            log(f'Found {len(images)} unique images', '  OK')
            if not images:
                fail_list.append((project['name'], 'No images'))
                continue
            assets = []
            for i, (uuid, img_url) in enumerate(images):
                fn = f'{project["slug"]}-{i+1:03d}.jpg'
                try:
                    log(f'({i+1}/{len(images)}) Downloading {fn}...')
                    data = download_image(img_url)
                    hdr = data[:4].hex()
                    if not (hdr.startswith('ffd8ff') or hdr == '89504e47'):
                        log(f'({i+1}/{len(images)}) SKIP not image (header:{hdr})', 'WARN')
                        continue
                    log(f'({i+1}/{len(images)}) Downloaded ({len(data)/1048576:.1f}MB). Uploading...')
                    asset = upload_to_sanity(data, fn)
                    log(f'({i+1}/{len(images)}) OK: {asset["_id"]}', '  OK')
                    assets.append(asset)
                    total += 1
                    if i < len(images)-1:
                        time.sleep(0.5)
                except Exception as e:
                    log(f'({i+1}/{len(images)}) FAILED: {e}', ' ERR')
            log(f'Uploaded {len(assets)}/{len(images)} images', '  OK')
            if assets:
                did = create_project_doc(project, assets)
                log(f'Created doc: {did}', '  OK')
                ok_list.append((project['name'], len(assets), did))
            else:
                fail_list.append((project['name'], 'All failed'))
            time.sleep(2)
        except Exception as e:
            log(f'FAILED: {e}', ' ERR')
            fail_list.append((project['name'], str(e)))
    log(f'')
    log(f'{"="*50}')
    log(f'DONE: {len(ok_list)} OK, {len(fail_list)} failed, {total} images')
    log(f'{"="*50}')
    for n, c, d in ok_list:
        log(f'  {n}: {c} images (doc: {d})', '  OK')
    for n, e in fail_list:
        log(f'  {n}: {e}', ' ERR')

if __name__ == '__main__':
    main()
