# Security

- Do not commit credentials, API keys, database connection strings, or environment variables.
- Use local `.env` files for development and GitHub Secrets for CI/CD.
- All WordPress plugins must use nonce verification for AJAX endpoints.
- If a credential is exposed accidentally, rotate the exposed credential first and then clean the Git history.
