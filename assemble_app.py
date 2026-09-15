from pathlib import Path
import shutil


tpl = open('template.html', encoding='utf-8').read()
data_js = open('data_block.js', encoding='utf-8').read()
app_js = open('app_logic.js', encoding='utf-8').read()
out = tpl.replace('__DATA_JS__', data_js, 1)
out = out.replace('__APP_JS__', app_js, 1)
open('app.html', 'w', encoding='utf-8').write(out)

# Cloudflare Pages deploys only dist/.  Keep the source tree and its raw learning
# materials outside the public deployment output.
dist_dir = Path('dist')
dist_dir.mkdir(exist_ok=True)
shutil.copyfile('app.html', dist_dir / 'index.html')

print('app.html bytes:', len(out))
print('deployment artifact:', dist_dir / 'index.html')
