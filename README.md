<p align="center">
  <strong>TKB Strategies</strong>
</p>

<p align="center">
  Open frameworks, tools, and methodology for mission-driven organizations.
</p>

<p align="center">
  <a href="https://github.com/TKB-Strategies/OpenStrategies/blob/main/LICENSE"><img src="https://img.shields.io/github/license/TKB-Strategies/OpenStrategies?style=flat-square&color=345168" alt="License" /></a>
  <a href="https://tkb-strategies.github.io/OpenStrategies/"><img src="https://img.shields.io/badge/docs-live-ffb356?style=flat-square" alt="Documentation" /></a>
  <a href="https://github.com/TKB-Strategies/OpenStrategies/actions"><img src="https://img.shields.io/github/actions/workflow/status/TKB-Strategies/OpenStrategies/deploy-docs.yml?style=flat-square&label=deploy" alt="Deploy Status" /></a>
  <a href="https://tkbstrategies.com"><img src="https://img.shields.io/badge/site-tkbstrategies.com-345168?style=flat-square" alt="Main Site" /></a>
</p>

---

## OpenStrategies

TKB Strategies is a human-centered strategy consulting firm specializing in liberation-centered organizational development, executive coaching, and capacity building. **OpenStrategies** is the public-facing repository where our consulting methodology, frameworks, tools, and templates live as open-source — version-controlled, forkable, and free to use.

The premise is simple: the frameworks and tools that strengthen organizations should be accessible, not locked behind proposals.

---

### What's Here

- **[Compassionate Agility](https://tkb-strategies.github.io/OpenStrategies/docs/frameworks/compassionate-agility)** — A framework for navigating organizational change through empathy, clarity, and adaptive leadership.
- **[Liberation Mapping](https://tkb-strategies.github.io/OpenStrategies/docs/frameworks/liberation-mapping)** — Strategic planning methodology that centers dignity, collective care, and systemic transformation.
- **[The Steward's Manual](https://tkb-strategies.github.io/OpenStrategies/docs/frameworks/stewards-manual)** — A guide for mission-driven leaders on sustainable organizational stewardship.
- **[Patterns & Protection Quiz](https://tkb-strategies.github.io/OpenStrategies/docs/tools/quiz)** — Trauma-informed self-reflection tool for understanding workplace response patterns. Built as a custom WordPress plugin.
- **[Workshop Templates](https://tkb-strategies.github.io/OpenStrategies/docs/workshops)** — Reusable facilitation structures for trainings, retreats, and conference sessions.
- **[Documentation Site](https://tkb-strategies.github.io/OpenStrategies/)** — Browse all frameworks and methodology on our Docusaurus-powered site.

### What's Not Here

Client-specific data, engagement details, financials, or confidential organizational information. Our client work lives in private systems. This is the reusable, public-facing layer.

---

### Docs

- [Documentation Site](https://tkb-strategies.github.io/OpenStrategies/)
- [Project Roadmap](docs/ROADMAP.md)
- [Monorepo Migration Plan](docs/MONOREPO-MIGRATION-PLAN.md)
- [Architecture Records](docs/architecture/README.md)
- [Services Architecture](docs/SERVICES-ARCHITECTURE.md)
- [Technology Stack](docs/STACK.md)
- [Contributing](docs/CONTRIBUTING.md)
- [Security Policy](docs/SECURITY.md)

---

### Contributing

We welcome contributions that align with the mission and meet the standards outlined below.

#### Ground Rules

**The client-data boundary is non-negotiable.** Before committing anything, ask: *"Could I share this publicly without compromising any client or individual?"* If the answer is no, it doesn't belong here. See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for the full policy.

All conversations and contributions are expected to be positive, productive, and respectful. This repository reflects a liberation-centered practice — that includes how we treat each other in issues, pull requests, and discussions.

#### Reporting Issues or Proposing Ideas

If you've found something that needs fixing or have an idea for improving a framework, template, or tool, [open an issue](https://github.com/TKB-Strategies/OpenStrategies/issues/new). We read every one.

#### Writing Documentation or Framework Content

If you've applied one of these frameworks and learned something that wasn't obvious, your experience can strengthen the documentation for everyone. Framework docs are Markdown files in the `apps/docs-site/docs/` directory and publish automatically to the [documentation site](https://tkb-strategies.github.io/OpenStrategies/) on merge to `main`.

#### Fixing a Bug or Building a Feature

Open an issue first so we can discuss scope and approach. When ready, submit a pull request against `main`. All changes go through PR review — direct pushes to `main` are blocked by branch protection.

---

### Codebase

#### Technologies

This repository spans consulting methodology (Markdown), web tooling (PHP/WordPress), private delivery applications, and documentation infrastructure (JavaScript/React):

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frameworks & Content | Markdown | Consulting methodology, workshop templates, presentations |
| Legacy WordPress Surfaces | PHP, MySQL, WordPress AJAX API | Transitional assessment and theme delivery on [tkbstrategies.com](https://tkbstrategies.com) |
| Client and Product Apps | Docusaurus, Vite, React | Private delivery surfaces and standalone tools being migrated into the monorepo |
| Documentation Site | Docusaurus, React, CSS | Public-facing site at [tkb-strategies.github.io/OpenStrategies](https://tkb-strategies.github.io/OpenStrategies/) |
| CI/CD | GitHub Actions | Automated Docusaurus builds and deploys to GitHub Pages |
| Hosting | Namecheap (cPanel), GitHub Pages | WordPress on shared hosting, docs on GitHub Pages |

#### Folder Structure

```
OpenStrategies/
├── .claude/                    # Claude Code AI context & permissions
├── .github/
│   ├── profile/                # GitHub Organization profile README
│   └── workflows/              # GitHub Actions (Docusaurus deploy)
├── apps/
│   ├── client-portal/          # Private client knowledge-base app imported for migration
│   ├── docs-site/              # Docusaurus documentation site
│   │   ├── blog/               # "Building in Public" journal
│   │   ├── docs/               # Published documentation (frameworks, tools, workshops)
│   │   ├── src/                # Landing page, CSS theme, components
│   │   └── docusaurus.config.js # Site configuration
│   └── healing-plan/           # Standalone facilitation app imported for migration
├── legacy/
│   ├── wordpress-plugin-quiz-tracker/ # Legacy WordPress plugin bridge
│   └── wordpress-theme-tkb-child/ # Legacy WordPress theme bridge
├── docs/
│   ├── CONTRIBUTING.md         # Contribution guidelines & client-data boundary
│   ├── MONOREPO-MIGRATION-PLAN.md # SaaS-oriented restructuring plan
│   ├── OPERATIONS-JOURNAL.md   # Daily operations closeout log
│   ├── ROADMAP.md              # 9-phase project plan (82 tasks)
│   ├── SECURITY.md             # Security & credential policy
│   └── STACK.md                # Full technology stack documentation
├── frameworks/
│   ├── compassionate-agility/  # Compassionate Agility framework source
│   ├── liberation-mapping/     # Liberation Mapping framework source
│   └── stewards-manual/        # Steward's Manual framework source
├── services/
│   ├── api/                    # Tenant-aware API service contracts
│   ├── auth/                   # Identity and tenant-boundary contracts
│   ├── jobs/                   # Reserved for background processing
│   └── webhooks/               # Reserved for event integrations
├── presentations/
│   └── templates/              # Conference & speaking engagement templates
├── products/
│   ├── courses/                # Udemy course source material
│   └── gumroad/                # Gumroad digital product source
├── tooling/
│   └── scripts/                # Repository setup and migration scripts
├── workshops/
│   └── templates/              # Facilitation & training templates
├── .gitattributes              # Line ending enforcement
├── .gitignore                  # Exclusion rules (secrets, client data, build artifacts)
├── .mcp.json                   # MCP server integrations for Claude Code
├── CLAUDE.md                   # Root AI context (architecture, standards, boundaries)
├── LICENSE                     # MIT
└── README.md                   # You are here
```

---

### Building in Public

This project is being built in the open. Progress is tracked across a [9-phase roadmap](docs/ROADMAP.md) with 82 tasks, and every working session is logged in the [operations journal](docs/OPERATIONS-JOURNAL.md).

The repository has now completed its first structural migration into a working monorepo layout. The public docs app lives under `apps/docs-site/`, the private and product apps live under `apps/`, shared logic has begun moving into `packages/`, legacy WordPress surfaces are isolated under `legacy/`, and the first service-layer contracts now live under `services/`. All three current app lanes build from their monorepo locations. Future application, package, service, and legacy lanes are documented in the [Monorepo Migration Plan](docs/MONOREPO-MIGRATION-PLAN.md).

Follow along on the [Building in Public journal](https://tkb-strategies.github.io/OpenStrategies/blog), read the milestone journal entries in [docs/journal](docs/journal/README.md), or watch the commit history.

---

### About

**TKB Strategies** is led by [Tekoah Boatner](https://tkbstrategies.com), CEO of Youth Oasis (Louisiana's first organization serving young people experiencing homelessness) and founder of TKB Strategies. With over two decades in nonprofit leadership and human services, the work sits at the intersection of strategy, culture, and equity — creating liberatory systems where both missions and the humans behind them can thrive.

- [tkbstrategies.com](https://tkbstrategies.com) — Main consulting site
- [Documentation](https://tkb-strategies.github.io/OpenStrategies/) — Open frameworks and methodology
- [Work with Me](https://tkbstrategies.com/work-with-me/) — Schedule a consultation

---

### License

[MIT](LICENSE) — Frameworks and tools are free to use, modify, and distribute. Attribution would be nice though.
