# Liste les chaînes françaises des scripts (accents \xE9 décodés), pour préparer js.json.
import re, sys, json, os
ICI = os.path.dirname(os.path.abspath(__file__)); RACINE = os.path.dirname(ICI)
def decode(code):
    def rep(m):
        c = chr(int(m.group(1) or m.group(2), 16))
        return c if ord(c) >= 0xA0 and c not in '  ' else m.group(0)
    return re.sub(r'(?<!\\)\\x([0-9A-Fa-f]{2})|(?<!\\)\\u([0-9A-Fa-f]{4})', rep, code)
FR = re.compile(r"[éèêëàâùûüôîïçœÉÈÊÀÂÔÎÇ’]|\b(le|la|les|de|des|du|un|une|et|ou|vous|votre|vos|pour|sur|avec|sans|mon|ma|mes|est|pas|ne|au|aux|je|il|qui|que|ce|se|son|sa|ses|toucher|voir)\b", re.I)
def chaines(code, exclure=()):
    out = []
    for m in re.finditer(r'"((?:[^"\\\n]|\\.)*)"|\'((?:[^\'\\\n]|\\.)*)\'|`((?:[^`\\]|\\.)*)`', code):
        if any(a <= m.start() <= b for a, b in exclure): continue
        x = next(g for g in m.groups() if g is not None) if any(g is not None for g in m.groups()) else ''
        if len(x) < 2 or not re.search(r'[A-Za-zÀ-ÿ]{2,}', x): continue
        if not FR.search(x): continue
        if re.fullmatch(r'[\w.#\[\]=:>,*\s()"\'-]+', x) and not re.search(r'\s', x): continue
        out.append((m.start(), x))
    return out
if __name__ == '__main__':
    f = sys.argv[1]
    code = decode(open(os.path.join(RACINE, f), encoding='utf-8').read())
    excl = [(35842, 49299), (93500, 115700)] if '6c5dfe3706' in f else []
    vus = set()
    for p, x in chaines(code, excl):
        if x in vus: continue
        vus.add(x); print('%d\t%s' % (p, x[:400].replace('\n', '\\n')))
