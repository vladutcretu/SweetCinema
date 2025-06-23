# Notes
This document tracks versioned release notes (features, fixes, refactors, etc.) and development notes (workflow, technical updates, TODOs, etc.) for the project.


## Table of Contents
1. [Release Notes](#release-notes)
2. [Development Notes](#development-notes)


## Release Notes

### 🔜 v0.2.0-alpha (completed on <i>TBA</i>)

### ✅ v0.1.0-alpha (completed on 18 June 2025; include Sprint #1, Sprint #2, Sprint #3)
- 🚀 <b>Features:</b>
    - User can select a cinema location, which remains saved for the entire site usage. The location can be changed at any time and help to filter information regarding that cinema location only.
    - User can see a list of available movies and choose a movie from the list to load more details, including its showtimes.
    - User can choose a showtime to see details about, including the available seats in the theater where it's playing.

- ⚙️ <b>Backend:</b>
    - Build `Genre`, `Movie`, `City`, `Theater`, `Seat` and `Showtime` models
    - Create following API endpoints: `GET /api/movies/`, `GET /api/movies/{id}/`, `GET /api/movies/genres/`, `GET /api/locations/cities/`, `GET /api/locations/seats/`, `GET /api/locations/theaters/`, `GET /api/locations/theaters/{id}/`, `GET /api/showtimes/`, `GET /api/showtimes/{id}/`
    - Add filters to some endpoints to get the necessary information; can read below about every endpoint used, their filters and the data received.
- 🖼️ <b>Frontend:</b>
    - Set page layout and core functionalities
    - Fetch data for all `City` objects using `/api/locations/cities/` endpoint to let user select their City location using `header navigation bar` component; selection is being saved to `localStorage` via a context, in order to being used on another API endpoints calls
    - Fetch data for all `Movie` objects using `/api/movies/` endpoint to present in the `main page`, using `MovieList` page components, a list of the existing movies to the user
    - Add in the `main page` the option for a user to see additional details about a movie, clicking a button would reach `movie detail page`
    - Fetch data for a single `Movie` object using `/api/movies/{id}/` endpoint to present in the `movie detail page`, using `MovieDetail` page components, more details about the movie requested by user
    - Fetch data for specific `Showtime` objects using `/api/showtimes/?movie={id}&theater__city={id}` to present in the `movie detail page`, using `MovieDetail` page components, a list of the existing showtimes to the user, based by user movie and city choice
    - Add in the `movie detail page` the option for a user to see additional details about a showtime, clicking a button would reach `showtime detail page`
    - Fetch data for a single `Showtime` object using `/api/showtimes/{id}/` to present in the `showtime detail page`, using `ShowtimeDetail` page components, more details about the showtime requested by user
    - Fetch data for all specific `Seat` objects using `/api/locations/seats/?theater={id}` to present in the `showtime detail page`, using `ShowtimeDetail` page components, a list of the existing seats in the theater where the showtime will take place


## Development Notes

### 🔜 Sprint #5 (started on 23 June 2025; ended on <i>TBA</i>)
- Start `tickets` app and create `Booking` and `Payment` models
- Use the foreign key relationships between models `Booking`, `Showtime`, `Seat` (via `Theater`) to check the status of a `Seat` object for a `Showtime` in `Booking` table entries as is following: 
	- no instance of `Booking` for `Showtime` + `Seat` means the `Seat` object is unoccupied
	- instance of `Booking` for `Showtime` + `Seat` with status=reserved/purchased means the `Seat` object is reserved/purchased
- Create, respecting the above logic, the API endpoint `GET /api/showtimes/{id}/seats/` with following sample response:
```json
	[
        {
            "id": 1, "row": 1, "column": 1, "status": "available"
        },
        {
            "id": 2, "row": 1, "column": 2, "status": "reserved"
        }, 
        {
            "id": 3, "row": 1, "column": 3, "status": "purchased"
        },
        {
            "id": 4, "row": 1, "column": 4, "status": "reserved by me"
        },
        {
            "id": 5, "row": 1, "column": 5, "status": "purchased by me"
        }
    ]
```
- Fetch the above mentioned endpoint in `showtime detail page` to present the status of every seat of the theater for the specific showtime
- Set, on the previously mentioned page, for every one of the newly implemented seat representation two options: reserve a seat and pay a seat 
	- Reserve a seat: fetch `POST /api/tickets/reserve/` (sending informations about `Showtime` and `Seat` objects) that will create a `Booking` instance with status=reserved and return a confirmation message afterwards
	- Pay a seat: fetch `POST /api/tickets/pay/` (sending informations about `Showtime` and `Seat` objects) that will create a `Booking` instance with status=pending_payment and redirect user to `payment create page`, where user will introduce data to `POST /api/tickets/payment/{bookingId}/`; if data is correct and `Payment` status is accepted then update `Booking` status to purchased
- Delete all `Booking` instances that have status=reserved when associated `Showtime`'s time value is 30 minutes before it starts.
- Assure methods and checks to not double book a seat or to prevent a seat to have too much time with status=payment_pending.

### ✅ Sprint #4 (started on 22 June 2025; ended on 23 June 2025)
- Implement signing up & logging in with Google account using OAuth2.0 and JWT, respecting the following workflow:
	- Create `users` app and `POST /api/auth/google/` endpoint to receive the `id_token` from the frontend after the user logs in with their Google account
    - Validate the `id_token` on the backend and create or retrieve the user account
    - Generate a JWT and return to the frontend to store it in `localStorage`
    - Create `POST /api/token/verify/` to validate the token when needed
	- Display `reserve ticket` & `buy ticket` options from `ShowtimeDetail` page to logged in users only
	- Build `logout` button to remove the token from `localStorage`

### ✅ Sprint #3 (started on 14 June 2025; ended on 18 June 2025)
- Build core design elements: `header`, `navbar`, `footer`
- Develop the following pages: 
    - `main page`: draw movie cards (fetch data from `GET /api/movies/`) and add link to `movie details page`
    - `movie details page`: show detailed informations about a single movie (fetch data from `GET /api/movies/{id}/`), about showtimes informations (fetch data from `GET /api/showtimes/`) and add link to `showtime details page` (fetch data from `GET /api/showtimes/{id}/`)
    - `showtime details page`: show detailed informations about a single showtime (fetch data from `GET /api/showtimes/{id}/`), about theater and seats (fetch data from `GET /api/locations/theaters/{id}/` and `GET /api/locations/seats/`) and add links to `reserve a ticket` and `buy a ticket`.
- Do backend updates to ensure good working user workflow: choose `City` > choose `Movie` (see `Genre`) > choose `Showtime` (see `Theater` & `Seat`)

### ✅ Sprint #2 (started on 13 June 2025; ended on 13 June 2025)
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