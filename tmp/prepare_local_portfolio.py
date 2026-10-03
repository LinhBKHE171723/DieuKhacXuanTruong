from pathlib import Path
from PIL import Image, ImageOps, ImageDraw

source = Path('C:/Users/Admin/.codex/visualizations/2026/09/19/01a0b854-a9c7-7ca3-9455-954cf4e30425/portfolio')
target = Path('E:/PROJECT/DieuKhacXuanTruong/frontend/public/images/local-portfolio')
target.mkdir(parents=True, exist_ok=True)
items = [
    (9, 'mat-tien-cua-vom', (.512,.247,.998,.538)),
    (11, 'kien-truc-mai-vom', (.002,.247,.496,.538)),
    (26, 'canh-quan-khu-vui-choi', (.511,.548,.998,.838)),
    (16, 'dau-cot-la-acanthus', (.002,.247,.496,.538)),
    (16, 'dau-cot-cuon', (.512,.247,.998,.527)),
    (19, 'hoa-mat-cot-la', (.338,.247,.660,.838)),
    (19, 'hoa-mat-cot-oval', (.002,.247,.325,.838)),
    (22, 'tru-lan-can-vuong', (.002,.247,.325,.838)),
    (22, 'tru-lan-can-hoa-van', (.338,.247,.660,.838)),
    (27, 'biet-thu-loi-cam-on', (.600,.257,.998,.725)),
]
sheet = Image.new('RGB', (900, 1200), '#eee9e0')
for index, (page, name, bounds) in enumerate(items):
    with Image.open(source / f'page-{page:02}.jpg') as original:
        width, height = original.size
        crop = original.crop(tuple(round(v * (width if i % 2 == 0 else height)) for i, v in enumerate(bounds))).convert('RGB')
        crop.thumbnail((1400, 1800), Image.Resampling.LANCZOS)
        crop.save(target / f'{name}.webp', quality=90, method=6)
        thumb = ImageOps.contain(crop, (280, 250))
        x, y = (index % 3) * 300, (index // 3) * 300
        sheet.paste(thumb, (x + (300-thumb.width)//2, y))
        ImageDraw.Draw(sheet).text((x+8, y+255), name, fill='#332b20')
sheet.save(source / 'local-portfolio-preview.jpg')
print(f'Exported {len(items)} local WebP images')
