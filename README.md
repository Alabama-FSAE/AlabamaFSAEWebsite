# Crimson Racing Website

This is a plain HTML, CSS, and JavaScript website. It uses no build tools and can be hosted directly with GitHub Pages.

## How the files are organized

```text
index.html, about.html, cars.html, car.html,    The pages. They stay in the top folder
team.html, sponsors.html, sponsor-us.html       so their web addresses never change.
data/
  cars.json            Each car's text, results, leaders, and specifications
  car-photos.json      Each car's photo list (updated by tools/process_photos.py)
  team.json            Current leadership and faculty sponsor
  sponsors.json        Sponsor names, tiers, logos, and links
includes/              The header and footer shared by every page
assets/
  css/                 Shared stylesheets
  js/                  Page scripts
  fonts/               Website fonts
  images/
    site/              Homepage and banner images
    cars/CR26E/        Web-sized photos for one car
    cars/CR26E/thumbs/ Small gallery versions (created by the script)
    team/              Headshots
    sponsors/          Sponsor logos
tools/
  process_photos.py    Prepares car photos and updates the photo list
```

`cars.html` is the overview of every car. `car.html` is one template used for every car's detail page: the link says which car to show, as in `car.html?car=cr22`, and the page fills itself in from `data/cars.json`.

## The files your team will edit most often

- `data/cars.json` — car names, years, results, specifications, and leadership
- `data/team.json` — current leadership and faculty sponsor
- `data/sponsors.json` — sponsor names, tiers, logos, and links
- `includes/header.html` — the shared navigation
- `includes/footer.html` — the shared footer

## Add or update a car

1. Open `data/cars.json`.
2. Copy an existing car record.
3. Change its `id`, `name`, `year`, and content.
4. Keep commas between car records and do not add a comma after the final record.

The Cars page, Cars dropdown, and individual detail page all read this same file. Cars appear in the dropdown and in the previous and next links in the order they are listed in the file.

## Add car photos

Keep the full-size originals somewhere else, such as the team's OneDrive. The script replaces photos in the website folder with smaller versions.

1. Copy the photos into `assets/images/cars/<CAR NAME>/`, for example `assets/images/cars/CR26E/`. The folder name must match the car's name.
2. Install Pillow if you have not already: `pip install pillow`
3. Run:

```bash
python tools/process_photos.py
```

The script shrinks the photos, creates the thumbnails, removes camera data such as GPS location, and adds the photos to `data/car-photos.json`.

To change the order, reorder that car's list in `data/car-photos.json`. **The first photo is the car's main image.** Your order is kept the next time the script runs.

## Update the current team

Open `data/team.json` and change names or roles within the appropriate group. Keep the quotation marks around every text value.

## Update sponsors

Open `data/sponsors.json`. Each sponsor has:

- `name`
- `tier`: platinum, crimson, gold, silver, or bronze
- `logo`: an image path such as `assets/images/sponsors/sponsor-name.png`
- `website`: the sponsor's website address

Leave `logo` or `website` empty until that information is available.

## Preview the website

The shared header, footer, and data files are loaded with `fetch()`. The website must therefore run through a web server rather than by double-clicking `index.html`.

The easiest option is the Live Server extension in Visual Studio Code. Alternatively, open Terminal in this folder and run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Publish with GitHub Pages

The website is published automatically from the `main` branch, so **merging a pull request changes the live site**. Make changes on a separate branch and open a pull request.

To set up publishing on a new repository:

1. Open the repository's **Settings**.
2. Select **Pages**.
3. Choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)`.
5. Save the settings.

## Page scripts

- `assets/js/includes.js` loads the shared header and footer.
- `assets/js/navigation.js` controls navigation and builds the Cars dropdown.
- `assets/js/about-page.js` controls the sliding cards on the About page.
- `assets/js/cars-page.js` renders the interactive Cars archive.
- `assets/js/car-detail.js` renders every individual car.
- `assets/js/team-page.js` renders the current team.
- `assets/js/sponsors-page.js` renders sponsor tiers.
