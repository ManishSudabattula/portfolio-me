# Manish Sudabattula - Portfolio

A responsive, dependency-free portfolio focused on data engineering and applied AI. It is designed to deploy directly with GitHub Pages.

## Local preview

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

In the repository settings, open **Pages**, choose **Deploy from a branch**, select `master` and `/ (root)`, then save.

## Structure

- `index.html` - content and semantic page structure
- `styles.css` - responsive visual system and animation
- `script.js` - theme, filtering, navigation, and reveal interactions
- `projects/` - three research-backed interactive AI + data product prototypes

## AI + Data Product Lab

- **EvidenceGrid** - claim-level RAG evaluation and release gating
- **LineageGuard** - schema-change impact analysis using contracts and lineage
- **CarbonShift** - carbon-, cost-, and deadline-aware AI workload scheduling

Each prototype is dependency-free and includes links to the primary research or standards that motivated the product design. See [`projects/README.md`](projects/README.md) for scope and architecture notes.
