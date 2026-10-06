# Crimson Racing Website

This is a plain HTML, CSS, and JavaScript website. It uses no build tools and can be hosted directly with GitHub Pages.

## The files your team will edit most often

- `data/cars.json` — car names, years, results, specifications, leadership, and galleries
- `data/team.json` — current leadership and faculty sponsor
- `data/sponsors.json` — sponsor names, tiers, logos, and links
- `includes/header.html` — the shared navigation
- `includes/footer.html` — the shared footer

## Add or update a car

1. Open `data/cars.json`.
2. Copy an existing car record.
3. Change its `id`, `name`, `year`, content, and image paths.
4. Place any new images in `assets/`.
5. Keep commas between car records and do not add a comma after the final record.

The Cars page, Cars dropdown, and individual detail page all read this same file.

## Update the current team

Open `data/team.json` and change names or roles within the appropriate group. Keep the quotation marks around every text value.

## Update sponsors

Open `data/sponsors.json`. Each sponsor has:

- `name`
- `tier`: platinum, crimson, gold, silver, or bronze
- `logo`: an image path such as `assets/sponsor-name.png`
- `website`: the sponsor's website address

Leave `logo` or `website` empty until that information is available.

## Preview the website

The shared header, footer, and data files are loaded with `fetch()`. The website must therefore run through a web server rather than by double-clicking `index.html`.

The easiest option is the Live Server extension in Visual Studio Code. Alternatively, open Terminal in this folder and run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Publish with GitHub Pages

1. Upload all files and folders in this directory to the repository root.
2. Open the repository's **Settings**.
3. Select **Pages**.
4. Choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`.
6. Save the settings.

## Page scripts

- `assets/js/includes.js` loads the shared header and footer.
- `assets/js/navigation.js` controls navigation and builds the Cars dropdown.
- `assets/js/cars-page.js` renders the interactive Cars archive.
- `assets/js/car-detail.js` renders every individual car.
- `assets/js/team-page.js` renders the current team.
- `assets/js/sponsors-page.js` renders sponsor tiers.
