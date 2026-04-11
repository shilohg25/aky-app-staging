# AKY Frontend Project Guide

## What this project is
This is a frontend web app that runs from `index.html`.

It uses:
- `index.html` for page structure
- `style.css` / later `styles/app.css` for styles
- `script.js` / later `js/app.js` for app logic
- Supabase for auth, storage, and database calls

## Files in this project

### Main files
- `index.html`  
  Contains the page layout, screens, modals, tables, and buttons.

- `script.js` or `js/app.js`  
  Contains the main JavaScript logic for login, customers, invoices, payments, reports, logs, accounts, and document handling.

- `style.css` or `styles/app.css`  
  Contains the app styles.

- `logo.png` or `assets/logo.png`  
  The app logo image.

### Small support files
- `js/config.js`  
  Creates the Supabase client and stores startup config.

- `js/permissions.js`  
  Defines what each role can do.

- `js/state.js`  
  Stores shared in-memory app state.

## What is NOT included in this ZIP
This ZIP does not include:
- Supabase table definitions
- Supabase storage rules
- Supabase function source code
- deployment settings
- package.json
- automated tests

## Safe editing rules
1. Make a backup copy of the whole folder before editing.
2. Change one thing at a time.
3. Save the file.
4. Refresh the browser.
5. Check that the same feature still works.
6. If something breaks, undo only the last change first.

## Best places to edit
- If you want to change layout text or buttons, start in `index.html`
- If you want to change colors or spacing, start in the CSS file
- If you want to change app behavior, start in the main JS file

## Testing
There is no `package.json` in this project, so there is no confirmed `npm` command in this ZIP.

To test:
1. Save your changes
2. Open `index.html` in the browser, or refresh the page if it is already open
3. Click through the feature you changed

## Refactor order
Safest order:
1. Fix small HTML problems
2. Remove unused empty files
3. Keep the folder structure clean
4. Remove unused code
5. Only then consider splitting the giant JS file
