# Notes
This document tracks versioned release notes (features, fixes, refactors, etc.) and development notes (workflow, technical updates, TODOs, etc.) for the project.


## Table of Contents
1. [Release Notes](#release-notes)
2. [Development Notes](#development-notes)


## Release Notes

### 🔜 v0.3.0-alpha (completed on <i>TBA</i>)

### ✅ v0.2.1-alpha (completed on 25 June 2025)
- 🐛 Fixes
    - After adding status=declined_payment to Booking model: a Seat that have a declined Payment (have an existing Booking with status=declined_payment) could no longer be reserved / purchased.

### ✅ v0.2.0-alpha (completed on 25 June 2025; include Sprint #4, Sprint #5)
- 🚀 <b>Features:</b>
    - User can log in (and sign up at the same time) using personal Google account.
    - User see on the showtime page the status of every seat (available, reserved or purchased); only logged in users can reserve or pay ticket for an available seat by clicking a button.
    - Reserve button will inform user through an alert about his action status, and if success, the reservation creates and the seat become reserved.
    - Pay button will redirect user to payment page, where will user needs to select a payment method to confirm the payment for the booking.

- ⚙️ <b>Backend:</b>
    - Build `Booking` and `Payment` models
    - Create following API endpoints: `POST /api/users/auth-google/`, `POST /api/users/token/verify/`, `POST /api/users/token/refresh/`, `GET /api/tickets/booking/{id}/`, `POST /api/tickets/pay/`, `POST /api/tickets/pay/{booking_id}/`, `POST /api/tickets/reserve/`
    - Can read a short description of every endpoint via included Sprint's, or about their usage below

- 🖼️ <b>Frontend:</b>
    - Add `GoogleAuth` component to `header`; it includes a fetch to `/api/users/auth-google/` to let user authenticate with Google account, create / retrieve an app account and generate tokens for being saved in localStorage and in `AuthContext` (which manage user status: is logged in/out)
    - Fetch data for Showtime.seats using `api/showtimes/{showtime_id}/seats/` endpoint to present in the `showtime detail page` the statuses of the seats, plus a condition that only authenticated users can see `reserve / pay a ticket` buttons.
    - Add `TicketReserve` component to `showtime detail page`; it includes a fetch to `api/tickets/reserve/` with showtime_id and seat_id, creating a `Booking` object with `status=reserved`
    - Add `TicketPay` component to `showtime detail page`; it includes a fetch to `api/tickets/pay/` with with showtime_id and seat_id, creating a `Booking` object with `status=pending_payment` and redirecting user to `payment create page`, where:
        - fetch data for Booking using `api/tickets/booking/{booking_id}/` to present details in `BookingPresentation` component
        - build `PaymentMethodSelector` component to let user select a payment method
        - fetch data for Payment using `api/tickets/pay/{booking_id}/` to create a new instance with payment method previously selected
        - update `Payment.booking.status=purchased` if `Payment.status=accepted` else if `Payment.status=declined` update `Payment.booking.status=failed_payment` (condition to fail is `Payment.amount` != `Payment.booking.showtime.price`)


### ✅ v0.1.0-alpha (completed on 18 June 2025; include Sprint #1, Sprint #2, Sprint #3)
- 🚀 <b>Features:</b>
    - User can select a cinema location, which remains saved for the entire site usage. The location can be changed at any time and helps to filter information regarding that cinema location only.
    - User see on the main page a list of available movies and can select a movie from the list to load more details, including its showtimes.
    - User can select a showtime to see details about, including the number of cinema theater seats in the theater where it's playing.

- ⚙️ <b>Backend:</b>
    - Build `Genre`, `Movie`, `City`, `Theater`, `Seat` and `Showtime` models
    - Create following API endpoints: `GET /api/movies/`, `GET /api/movies/{id}/`, `GET /api/movies/genres/`, `GET /api/locations/cities/`, `GET /api/locations/seats/`, `GET /api/locations/theaters/`, `GET /api/locations/theaters/{id}/`, `GET /api/showtimes/`, `GET /api/showtimes/{id}/`
    - Add filters to some endpoints to get the necessary information
    - Can read a short description of every endpoint via included Sprint's, or about their usage below

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

### 🔜 Sprint #6 (started on 26 June 2025; ended on <i>TBA</i>): "Backend & Frontend - Staff dashboard & actions"
- Create groups `Manager` (can CRUD `City`, `Theater`, `Seat`, `Genre`, `Movie`, `Showtime` and Read `Booking`, `Payment`) & `Employee` (can CRUD `Genre`, `Movie`, `Showtime`) and the following API endpoints with superuser permissions: `POST api/users/promote/manager/{user_id}/`, `POST api/users/promote/employee/{user_id}/` and `POST api/users/demote/{user_id}/`
- Create, respecting the permissions of each group, API endpoints for completing the same actions each group can do from the backend admin panel
- Build a frontend staff dashboard page to let staff members (superuser, manager & employee) interact with above mentioned endpoints

### ✅ Sprint #5 (started on 23 June 2025; ended on 25 June 2025): "Backend & Frontend - Tickets reservations & payments"
- Start `tickets` app and create `Booking` and `Payment` models
- Use the foreign key relationships between models `Booking`, `Showtime`, `Seat` (via `Theater`) to check the status of a `Seat` object for a `Showtime` in `Booking` table entries as is following: 
	- no instance of `Booking` for `Showtime` + `Seat` means the `Seat` object is unoccupied
	- instance of `Booking` for `Showtime` + `Seat` with status=reserved/purchased means the `Seat` object is reserved/purchased
- Create, respecting the above logic, the API endpoint `GET /api/showtimes/{id}/seats/` with following sample response:
```json
	[
        {"id": 1, "row": 1, "column": 1, "status": "available"},
        {"id": 2, "row": 1, "column": 2, "status": "reserved"}, 
        {"id": 3, "row": 1, "column": 3, "status": "purchased"},
    ]
```
- Fetch the above mentioned endpoint in `showtime detail page` to present the status of every seat of the theater for the specific showtime
- Set, on the previously mentioned page, for every one of the newly implemented seat representation two options: reserve a seat and pay a seat 
	- Reserve a seat: fetch `POST /api/tickets/reserve/` (sending informations about `Showtime` and `Seat` objects) that will create a `Booking` instance with status=reserved and return a confirmation message afterwards
	- Pay a seat: fetch `POST /api/tickets/pay/` (sending informations about `Showtime` and `Seat` objects) that will create a `Booking` instance with status=pending_payment and redirect user to `payment create page`, where user will introduce data to `POST /api/tickets/payment/{bookingId}/`; if data is correct and `Payment` status is accepted then update `Booking` status to purchased, else if is not, `Payment` status gonna be declined and `Booking` status will be payment declined (available to book)

### ✅ Sprint #4 (started on 22 June 2025; ended on 23 June 2025): "Backend & Frontend - User authentication with Google"
- Implement signing up & logging in with Google account using OAuth2.0 and JWT, respecting the following workflow:
	- Create `users` app and `POST /api/auth/google/` endpoint to receive the `id_token` from the frontend after the user logs in with their Google account
    - Validate the `id_token` on the backend and create or retrieve the user account
    - Generate a JWT and return to the frontend to store it in `localStorage`
    - Create `POST /api/token/verify/` to validate the token when required and `POST /api/token/refresh/` to renew access token when expires
	- Display `reserve ticket` & `buy ticket` options from `ShowtimeDetail` page to logged in users only
	- Build `logout` button to remove the token from `localStorage`

### ✅ Sprint #3 (started on 14 June 2025; ended on 18 June 2025): "Frontend - Movies, Locations, Showtimes"
- Build core design elements: `header`, `navbar`, `footer`
- Develop the following pages: 
    - `main page`: draw movie cards (fetch data from `GET /api/movies/`) and add link to `movie details page`
    - `movie details page`: show detailed informations about a single movie (fetch data from `GET /api/movies/{id}/`), about showtimes informations (fetch data from `GET /api/showtimes/`) and add link to `showtime details page` (fetch data from `GET /api/showtimes/{id}/`)
    - `showtime details page`: show detailed informations about a single showtime (fetch data from `GET /api/showtimes/{id}/`), about theater and seats (fetch data from `GET /api/locations/theaters/{id}/` and `GET /api/locations/seats/`) and add links to `reserve a ticket` and `buy a ticket`.
- Do backend updates to ensure good working user workflow: choose `City` > choose `Movie` (see `Genre`) > choose `Showtime` (see `Theater` & `Seat`)

### ✅ Sprint #2 (started on 13 June 2025; ended on 13 June 2025): "Backend - Movies, Locations, Showtimes"
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

### ✅ Sprint #1 (started on 12 June 2025; ended on 12 June 2025): "Backend & Frontend - Project initialization"
- Configure git repository and initialize README with app workflow and database design overview
- Starting backend & frontend apps and installing their dependencies
- Dockerizing frontend, backend and postgresDB