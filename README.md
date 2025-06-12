# SweetCinema
SweetCinema is an open-source educational project inspired by an idea from [roadmap.sh](https://roadmap.sh/projects/movie-reservation-system) and using [HappyCinema](https://www.happycinema.ro/) as a muse for features and design. 


## Table of Contents
1. [Notes](#notes)
2. [Technology stack](#technology-stack)
3. [Technical achitecture](#technical-architecture)
    - [User workflow](#user-workflow)
    - [DB schema design](#db-schema-design)


## Notes
Check the file [NOTES.md](NOTES.md) to see Release Notes or Development Notes.

## Technology stack
- ⚙️ Backend: [Django REST Framework](https://www.django-rest-framework.org) with:
    - 🧶 [Ruff](https://docs.astral.sh/ruff/) for linting and code formatting.
    - 📄 [DRF-spectacular](https://drf-spectacular.readthedocs.io/en/latest/) for OpenAPI documentation.
- 💾 Database: [PostgresQL](https://www.postgresql.org/).
- 🖼️ Frontend: [React](https://react.dev/) and [Vite](https://vite.dev).
- 🧩Other tools:
    - 🗓️ [Jira](https://www.atlassian.com/software/jira) for planning work.
    - 🐋 [Docker Compose](https://www.docker.com/) for local development.


## Technical architecture

### User workflow
![User workflow](https://i.imgur.com/tu8nUz8.jpeg)

### DB schema design
![DB schema design](https://i.imgur.com/mpOoMu8.png)