# Velorix Agent Guidelines & Project Rules

## Versioning Rule (Mandatory)
Whenever any new change, feature, or bug fix is implemented in the codebase:
1. Increment the application version number in `/src/config/version.ts` (e.g., `1.00` -> `1.01` -> `1.02`...).
2. Update the `APP_BUILD_DATE` to the current date.
3. Keep `/package.json` version in sync.
4. Ensure the version badge (`APP_VERSION_LABEL`) continues to be displayed across the UI (hero badge, footer, legal modal).
