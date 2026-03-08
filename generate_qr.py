#!/usr/bin/env python3
"""
生成宠物管家App二维码
"""
import qrcode
import sys

def generate_qr(url, output_file):
    """生成二维码图片"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    # 创建二维码图片
    img = qr.make_image(fill_color="#667eea", back_color="white")
    
    # 添加logo（可选）
    try:
        from PIL import Image
        logo = Image.open('images/icon.svg')
        logo = logo.resize((60, 60))
        pos = ((img.size[0] - logo.size[0]) // 2, (img.size[1] - logo.size[1]) // 2)
        img.paste(logo, pos)
    except:
        pass
    
    # 保存
    img.save(output_file)
    print(f"✅ 二维码已生成: {output_file}")
    print(f"📱 扫描后访问: {url}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("用法: python3 generate_qr.py <URL>")
        print("示例: python3 generate_qr.py http://192.168.1.100:8080")
        sys.exit(1)
    
    url = sys.argv[1]
    generate_qr(url, 'qrcode.png')
