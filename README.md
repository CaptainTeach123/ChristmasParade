# Candy Cane Lane — Garden City Christmas Parade

A whimsical, candy-cane-themed website for the Garden City, Kansas Christmas Parade,
hosted by **Downtown Vision** and presented by **Commerce Bank**.

## Running locally

The site is plain HTML, CSS, and JavaScript with no build step. Open `index.html`
in a browser, or serve the folder:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Deploying

The site works as-is on GitHub Pages, Netlify, or any static host. Point the host
at the repository root.

## Updating each year

- **Parade date and time:** edit `PARADE_DATE` at the top of `js/main.js` and the
  "When" card plus the registration deadline in `index.html`.
- **Route and schedule:** edit the Route and Schedule sections of `index.html`.
- **Contact email:** replace the placeholder `info@downtownvision.example` addresses
  in `index.html`.
- **Entry form:** the form currently confirms on the page only. Wire the `submit`
  handler in `js/main.js` to a form service or backend to collect entries.

## Structure

```
index.html      Page content
css/styles.css  Candy Cane Lane theme
js/main.js      Countdown, snow, mobile nav, form handling
```
