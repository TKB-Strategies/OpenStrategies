# tkb-quiz-tracker-v2 Memory

This is a custom WordPress plugin for the "Patterns & Protection - Understanding Your Workplace Responses" quiz tool.

- It is deployed on `tkbstrategies.com` using a standalone HTML approach with a lightweight companion plugin for AJAX data capture.
- It uses `dbDelta()` for table creation and includes an admin dashboard for viewing responses.
- Tech stack: PHP, the WordPress AJAX API, MySQL via `$wpdb`, and JavaScript for front-end quiz interaction.
- When modifying this plugin, always test activation and deactivation hooks and verify that `dbDelta()` schema updates are idempotent.
