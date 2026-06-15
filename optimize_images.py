import os, json
from PIL import Image, ImageOps

SRC = r"K:\Claudeworkspace\carole"
DST = r"K:\Claudeworkspace\carole-portfolio\images"
MAX_DIM = 1600

os.makedirs(DST, exist_ok=True)

files = sorted([f for f in os.listdir(SRC) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])

manifest = []
for i, fname in enumerate(files, start=1):
    src_path = os.path.join(SRC, fname)
    try:
        img = Image.open(src_path)
        img = ImageOps.exif_transpose(img)
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')
        w, h = img.size
        if max(w, h) > MAX_DIM:
            ratio = MAX_DIM / max(w, h)
            new_size = (int(w * ratio), int(h * ratio))
            img = img.resize(new_size, Image.LANCZOS)
            w, h = new_size
        out_name = f"work-{i:03d}.jpg"
        out_path = os.path.join(DST, out_name)
        img.save(out_path, "JPEG", quality=82, optimize=True)
        manifest.append({
            "id": out_name,
            "original": fname,
            "width": w,
            "height": h,
            "orientation": "landscape" if w > h else ("portrait" if h > w else "square")
        })
        print(f"{fname} -> {out_name} ({w}x{h})")
    except Exception as e:
        print(f"ERROR {fname}: {e}")

with open(os.path.join(os.path.dirname(DST), "manifest.json"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print(f"\nDone. {len(manifest)} images processed.")
