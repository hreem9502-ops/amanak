#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
توليد باركود QR لفيديو شرح برنامج أمانك
=================================================
لتغيير الرابط: عدّل قيمة VIDEO_URL بالأسفل ثم شغّل السكربت:
    python3 make-qr.py
"""
import qrcode
from qrcode.constants import ERROR_CORRECT_M

# ✔️ رابط صفحة الفيديو على الموقع — الباركود يوصل مباشرة لصفحة تشغيل الفيديو الحقيقي
VIDEO_URL = "https://hreem9502-ops.github.io/amanak/video.html"

# ألوان متناسقة مع هوية أمانك
FILL_COLOR = "#4F41D6"   # البنفسجي الأساسي للموقع
BACK_COLOR = "#FFFFFF"

def make_qr(url, output, fill=FILL_COLOR, back=BACK_COLOR):
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_M,
        box_size=12,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color=fill, back_color=back)
    img.save(output)
    print(f"✓ QR saved: {output} -> {url}")

if __name__ == "__main__":
    # باركود الموقع (لصفحة الفيديو)
    make_qr(VIDEO_URL, "/home/z/my-project/download/amanak-website/images/qr-video.png")

    # نسخة بالأبيض والبنفسجي الفاتح (لملف الوورد - خلفية ملونة)
    make_qr(VIDEO_URL, "/home/z/my-project/download/amanak-website/images/qr-video-dark.png", fill="#FFFFFF", back="#4F41D6")

    # باركود رمادي داكن (احتياطي للطباعة بالأبيض والأسود)
    make_qr(VIDEO_URL, "/home/z/my-project/download/amanak-website/images/qr-video-print.png", fill="#1e1b4b", back="#FFFFFF")

    print("تم توليد جميع الباركودات بنجاح")
