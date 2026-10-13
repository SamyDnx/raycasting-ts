## How to run locally

1. **Clone the repository:**
```bash
   git clone https://github.com/SamyDnx/raycasting-ts.git
   cd raycasting-ts
```

2. **Compile the TypeScript** (TypeScript ≥ 5.0 required):
```bash
   # Génère dist/script.js (pas besoin d'installation globale)
   npx -p typescript tsc
```

3. **Start a local web server** (required: ES modules don't work from `file://`):
```bash
   # Python 3 est souvent déjà installé
   python3 -m http.server 8000
```

4. **Open** http://localhost:8000 in your browser.

> Development: run `npx -p typescript tsc -w` in a second terminal to recompile on save.
