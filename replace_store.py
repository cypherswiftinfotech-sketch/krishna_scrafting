import os
import re

def walk_and_replace():
    src_dir = os.path.join(os.getcwd(), 'src')
    for root, dirs, files in os.walk(src_dir):
        for f in files:
            if f.endswith('.ts') or f.endswith('.tsx'):
                filepath = os.path.join(root, f)
                with open(filepath, 'r', encoding='utf8') as file:
                    content = file.read()
                
                original = content
                
                # Replace URLs
                content = re.sub(r'/store\b', '/shop', content)
                content = re.sub(r'"store"', '"shop"', content)
                content = re.sub(r'\'store\'', '\'shop\'', content)
                
                # Replace visual texts
                content = re.sub(r'label:\s*["\']Store["\']', 'label: "Shop"', content)
                content = re.sub(r'>Store<', '>Shop<', content)
                content = re.sub(r'Back to Store', 'Back to Shop', content)
                content = re.sub(r'Our Store', 'Our Shop', content)
                content = re.sub(r'>Store Hero<', '>Shop Hero<', content)
                content = re.sub(r'title:\s*["\']Store["\']', 'title: "Shop"', content)
                
                if content != original:
                    with open(filepath, 'w', encoding='utf8') as file:
                        file.write(content)
                    print('Updated', filepath)

walk_and_replace()
