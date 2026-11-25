# Copie du site dans un dossier de prototype, chemins rendus relatifs pour fonctionner hors de la racine du domaine.
import os, re, shutil, sys
SRC = '/home/user/ascension-sport-sante.github.io'
DST = sys.argv[1]
if os.path.exists(DST): shutil.rmtree(DST)
EXCLUS_DOS = {'.git', 'seance', 'coach-sportif-domicile-paris'}
n = 0
for racine, dossiers, fichiers in os.walk(SRC):
    dossiers[:] = [d for d in dossiers if d not in EXCLUS_DOS]
    for f in fichiers:
        if f.endswith(('.mp4', '.webm')) or f in ('README.md', 'CNAME', 'robots.txt', 'sitemap.xml', 'llms.txt'): continue
        s = os.path.join(racine, f); r = os.path.relpath(s, SRC); d = os.path.join(DST, r)
        os.makedirs(os.path.dirname(d), exist_ok=True); shutil.copy2(s, d); n += 1
print('fichiers copiés', n)

TOP = r'(?:commun|sil|sys|fond|polices|kit|bilan|tarifs|methode|a-propos|cgv|confidentialite|mentions-legales|activite-physique-adaptee-domicile|remise-en-forme-domicile|preparation-physique-domicile|coach-sportif-enfants|coach-sportif-senior|mal-de-dos|reprise-apres-maladie|sport-sur-ordonnance|[A-Za-z0-9_.-]+\.(?:webp|png|jpg|svg|js|css|json|pdf|txt|ico|woff2))'
def rel_html(t, pre):
    t = re.sub(r'(href=")/("|#)', lambda m: m.group(1) + pre + 'index.html' + m.group(2), t)            # accueil
    t = re.sub(r'(["\'(=])/(' + TOP + ')', lambda m: m.group(1) + pre + m.group(2), t)                     # fichiers et pages
    pages = r'(bilan|tarifs|methode|a-propos|cgv|confidentialite|mentions-legales|kit|activite-physique-adaptee-domicile|remise-en-forme-domicile|preparation-physique-domicile|coach-sportif-enfants|coach-sportif-senior|mal-de-dos|reprise-apres-maladie|sport-sur-ordonnance)/(["#])'
    t = re.sub(r'(href="' + re.escape(pre) + r')' + pages, lambda m: m.group(1) + m.group(2) + '/index.html' + m.group(3), t)
    t = re.sub(r'url\(/', 'url(' + pre, t)
    return t
for racine, _, fichiers in os.walk(DST):
    for f in fichiers:
        p = os.path.join(racine, f); r = os.path.relpath(p, DST); prof = r.count('/'); pre = '../' * prof
        if f.endswith('.html'):
            t = open(p, encoding='utf8').read(); t = rel_html(t, pre)
            t = re.sub(r'(<meta charset[^>]*>)', r'\1<script>window.__R="' + pre + '"</script>', t, count=1)
            open(p, 'w', encoding='utf8').write(t)
        elif f.endswith('.css'):
            t = open(p, encoding='utf8').read(); open(p, 'w', encoding='utf8').write(re.sub(r'url\(\s*["\']?/', 'url(' + '../' * prof, t))
        elif f.endswith('.js'):
            t = open(p, encoding='utf8').read()
            t = t.replace('"accueil": "/"', '"accueil": (window.__R||"")+"index.html"')
            pages = 'bilan|tarifs|methode|a-propos|cgv|confidentialite|mentions-legales|kit|activite-physique-adaptee-domicile|remise-en-forme-domicile|preparation-physique-domicile|coach-sportif-enfants|coach-sportif-senior|mal-de-dos|reprise-apres-maladie|sport-sur-ordonnance'
            regles = [(r'"/((?:' + pages + r')/)"', lambda m: '(window.__R||"")+"' + m.group(1) + 'index.html"'),
                      (r'="/(' + TOP + ')', lambda m: '="' + chr(39) + '+(window.__R||"")+' + chr(39) + m.group(1)),
                      (r'=\\"/(' + TOP + ')', lambda m: '=\\""+(window.__R||"")+"' + m.group(1)),
                      (r'(?<!\\)"/(' + TOP + ')', lambda m: '(window.__R||"")+"' + m.group(1))]
            import subprocess, tempfile
            def valide(s):
                tf = tempfile.NamedTemporaryFile('w', suffix='.js', delete=False); tf.write(s); tf.close()
                ok = subprocess.run(['node', '--check', tf.name], capture_output=True).returncode == 0; os.unlink(tf.name); return ok
            if any(re.search(a, t) for a, _ in regles):
                for a, fn in regles:
                    for m in list(re.finditer(a, t))[::-1]:
                        t2 = t[:m.start()] + fn(m) + t[m.end():]
                        if valide(t2): t = t2
            open(p, 'w', encoding='utf8').write(t)
print('chemins adaptés')
