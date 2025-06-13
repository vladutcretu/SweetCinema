# Notes
This document tracks versioned release notes (features, fixes, refactors, etc.) and development notes (workflow, technical updates, TODOs, etc.) for the project.


## Table of Contents
1. [Release Notes](#release-notes)
2. [Development Notes](#development-notes)


## Release Notes

### 🔜 v0.0.1-alpha (released on <i>TBA</i>)


## Development Notes

### 🔜 Sprint #2 (started on 13 June 2025; ended on <i>TBA</i>)
- Start `movies` app and create `Movie`, `Genre`, `MovieGenre` models, alongside with the following API endpoints: 
    - `GET /api/movies/`: list all the `Movie` objects
    - `GET /api/genres/`: list all the `Genre` objects
    - `GET /api/movie/<ID>/`: detail a specific `Movie` object
- Start `locations` app and create `City`, `Theater`, `Seat` models, alongside with the following API endpoints:
    - `GET /api/cities/`: list all the `City` objects 
    - `GET /api/theaters/?city=<ID>`: list all the `Theater` objects linked to a specific `City` object
    - `GET /api/seats/?theater=<ID>`: list all the `Seat` objects linked to a specific `Theater` object
- Start `showtimes` app and create `Showtime` model, alongside with the following API endpoints:
    - `GET /api/showtimes/?city=<ID>&movie=<ID>`: list all the `Showtime` objects linked to a specific `City` and `Movie` objects
    - `GET /api/showtimes/<ID>/`: detail a specific `Showtime` object with linked `Theater` object included

### ✅ Sprint #1 (started on 12 June 2025; ended on 12 June 2025)
- Configure git repository and initialize README with app workflow and database design overview
- Starting backend & frontend apps and installing their dependencies
- Dockerizing frontend, backend and postgresDB