# alya.os

My personal website: a desktop you can click around in. Folders open in a Finder-style window, podcast episodes play in a QuickTime-style player, and there's a working terminal (try `help`, then go looking for the commands it doesn't list).

Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Editing

All the content lives in **`content.js`**. You shouldn't need to touch anything else.

| To… | Do this in `content.js` |
| --- | --- |
| Add a book | Add a line to `books` with `status: "reading"`, `"read"` or `"next"` |
| Make an episode play on the site | Paste its YouTube ID (the part after `watch?v=`) into `youtubeId` |
| Add a new episode | Add it to the top of `podcast.episodes` |
| Add your photo | Put it in `assets/photos/` and set `owner.photo` |
| Add a downloadable resume | Put the PDF in `assets/` and set `owner.resumePdf` |
| Log cybersecurity progress | Add an entry to `learningLog` (shows up via `learning` in the terminal) |
| Add LinkedIn | Fill in its `url` in `links` |

## Running locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Deploying

GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / root**. The `.nojekyll` file makes Pages serve the files as they are.

Inspired by [ansxuman/macOS-Themed-Portfolio](https://github.com/ansxuman/macOS-Themed-Portfolio). The code and icons here are original.
