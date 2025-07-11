# Notes
This document tracks versioned release notes (features, fixes, refactors, etc.) and development notes (workflow, technical updates, TODOs, etc.) for the project.


## Table of Contents
1. [Release Notes](#release-notes)
2. [Development Notes](#development-notes)


## Release Notes

### 🔜 v0.8.0-beta (completed on <i>TBA</i>)
♻️ **Refactors:**
- Design `Layout`, `Header`, `Navbar`, `Footer` components
- Create `cityService`, `useGetCities` to fetch Navbar
- Refactor `GoogleAuth`, `AuthContext` components
- Refactor `MovieList` to `Home` page, `MoviesGrid` & `MovieCard` components
- Add automatic refresh after City selection on `Navbar`
- Create `ForwardButton`, `BackButton`, and `DateTimeFormat` components
- Update button on `MovieCard`
- Create `useGetMovie` & `useGetMovieShowtimesByCity`, `showtimeService` and update `movieService`
- Refactor `MovieDetail` to `Movie` page, `MoviePresentation` & `MovieShowtimes` components
- Create `useGetShowtime`, `useGetShowtimeSeats`, and update `showtimeService`
- Refactor `ShowtimeDetail` to `Showtime` page, `ShowtimePresentation` & `ShowtimeSeats` components
- Create `useShowtimeSeatSelect`, `ticketService`, `usePostTicketReserve` & `usePostTicketPurchase` and update `showtimeService`
- Refactor `TicketReserve` & `TicketPay` components to `ShowtimeTicket` component


### ✅ v0.7.0-alpha (completed on 6 July 2025)
🚀 **Features:**
- Extends user's account account informations with a user profile: contains only city for now, but can be developed for personalized emails (promotions for birthday, city).
- Add "Cashier" role and permits access to Staff Dashboard, where they can complete a reservation or sell tickets for walk-in customers.

⚙️ **Backend:**
- Create `UserProfile` model and `Cashier` group
- Update `permissions` file and endpoints `POST /api/users/user/set-password/` & `POSt /api/users/user/verify-password/` to include `Cashier`
- Create endpoints: `PATCH /api/users/user/update-city/{user_id}/`, `GET /api/tickets/booking/cashier/`, `PATCH /api/tickets/bookings/cashier/{id}/`, `GET /api/showtimes/{id}/report/`

🖼️ **Frontend:**
- Update `UserManagement component` to set `Cashier role` and user's `City`, `UserProfile` & `StaffDashboard` pages to allow access to `Cashier` to new components
- Create `BookingDashboard` & `ShowtimeDashboard`, `ShowtimeReport` components
---
### ✅ v0.6.0-alpha (completed on 3 July 2025)
🚀 **Features:**
- Build Shows page where users see complete list of showtimes in their City location.
- Users can now reserve up to 5 seats in a single transaction but they can not make reservations for showtimes that have less than 30 minutes until starts.
- Users can now purchase multiple seats, without limits, in a single transaction, but they have 1 minute to complete the payment, otherwise it is going to be declined.
- Reservations now expire when the showtime starts in less than 30 minutes.

⚙️ **Backend:**
- Update models: 
    - `Booking` status include now `expired` option, and add new field expires_at, that is not null only for instances with status=reserverd & status=pending_payment
    - `Payment` booking (`ForeignKey` type) field is now bookings (`ManyToManyField` type) field
    - `Showtime` date, time fields got replaced by starts_at (`DateTimeField`), and add a unique_together condition with it and theater field
- Update endpoints: `POST /api/tickets/reserve/`, `POST /api/tickets/pay/` is now `POST /api/tickets/purchase/`, `POST /api/tickets/pay/{id}/` is now `POST /api/tickets/pay/` (serializers and views also got modified)
- Create endpoints: `POST /api/tickets/pay/bookings/`, `PUT /api/tickets/pay/timeout/`
- Create custom django-admin command `expired_bookings` (`Booking` instances that have expires_at past current time and `status=[reserved, pending_payment]` are updated to `status=expired`) and schedule a cron job (every 5 minutes) for cleanup

🖼️ **Frontend:**
- Create `ShowtimeList page`, and `TimerToFailedPayment` component inside `PaymentCreate page`
- Update `ShowtimeDetail page`, `TicketReserve` & `TicketPay` components, `PaymentCreate` page (url is now static) and it's components
- Update in all components: `showtime.date`, `showtime.time` to `showtime.starts_at`

🐋**Docker Compose:**
- Add services: Redis, Celery, django-celery-beat
---
### ✅ v0.5.0-alpha (completed on 1 July 2025)
🚀 **Features:**
- Build User Profile where users see some account details, their all time bookings, can cancel active reservations and reach Staff Dashboard.
- Staff Dashboard is now marked as sensible content; in order to access it staff user need to set an account password first and then to enter it on every new session when they access the page.

⚙️ **Backend:**
- Update `Booking` status with `canceled` option
- Create endpoints: `GET /api/tickets/bookings/history/`, `POST /api/tickets/booking/{id}/cancel/`, `POST /api/users/user/set-password/`, `POST /api/users/user/verify-password/`

🖼️ **Frontend:**
- Create `UserProfile page` and a `BookingHistory component` to be included in, also add link to `Staff Dashboard page` for adequates roles
- Create components `PasswordSet` and `PasswordVerify` for so-called `2FA` of staff roles
- Update `AuthContext` to save status of `2FA`
---
### ✅ v0.4.0-alpha (completed on 29 June 2025; include Sprint #6)
🚀 **Features:**
- Build Staff Dashboard where site admins see a list of users and can assign roles as "Manager" or "Employee".
- On the same page, "Employee" can see lists of existing genres, movies, showtimes, and can create, update, delete entries, while "Manager" can do the same, but in addition can view, create, update, delete cities and theaters, as well as view bookings and payments made by users.

⚙️ **Backend:**
- Create `permissions` file to filter access to endpoints for `Manager` & `Employee` groups.
- Create endpoints: `GET /api/users/`, `GET /api/users/user`, `PATCH /api/users/user/update/{id}/`, `POST /api/movies/genres/create/`, `PUT /api/movies/genres/{id}/`, `DELETE /api/movies/genres/{id}/`, `POST /api/movies/create/`, `PATCH /api/movies/movie/{id}/`, `DELETE /api/movies/movie/{id}/`, `POST /api/locations/cities/create/`, `PUT /api/locations/cities/{id}/`, `DELETE /api/locations/cities/{id}/`, `POST /api/locations/theaters/create/`, `PATCH /api/locations/theaters/staff/{id}/`, `DELETE /api/locations/theaters/staff/{id}/`, `GET /api/showtimes/staff/`, `POST /api/showtimes/staff/create/`, `PATCH /api/showtimes/staff/{id}/`, `DELETE /api/showtimes/staff/{id}/`, `GET /api/tickets/bookings/`, `GET /api/tickets/payments/`

🖼️ **Frontend:**
- Update `AuthContext` to retrieve data (user groups, staff status) about the user and save it
- Create `RequirePermissions component` to restrict access to children components based on user's groups, staff status
- Create `StaffDashboard page` and his components: 
    - `UserManagement`: for staff, to list users and update a user groups
    - `GenreManagement`: for `Manager` & `Employee`, to list, create, update and delete genres
    - `MovieManagement`: for `Manager` & `Employee`, to list, create, update and delete movies
    - `CityManagement`: for `Manager`, to list, create, update and delete cities
    - `TheaterManagement`: for `Manager`, to list, create, update and delete theaters
    - `ShowtimeManagement`: for `Manager` & `Employee`, to list, create, update and delete showtimes
    - `BookingManagement` & `PaymentManagement`: for `Manager`, to list bookings & payments
---
### ✅ v0.3.1-alpha (completed on 25 June 2025)
🐛 **Fixes:**
- A seat that have a declined payment could now be reserved / purchased again.
---
### ✅ v0.3.0-alpha (completed on 25 June 2025; include Sprint #5)
🚀 **Features:**
- User see on the showtime page the status of every seat (available, reserved or purchased); only logged in users can reserve or pay ticket for an available seat by clicking a button.
- Reserve button will inform user through an alert about his action status, and if success, the reservation creates and the seat become reserved.
- Pay button will redirect user to payment page, where will user needs to select a payment method to confirm the payment for the booking.

⚙️ **Backend:**
- Start `tickets` app and migrate `Booking` and `Payment` models
- Create endpoints: `GET /api/tickets/booking/{id}/`, `POST /api/tickets/pay/`, `POST /api/tickets/pay/{booking_id}/`, `POST /api/tickets/reserve/`

🖼️ **Frontend:**
- Update `ShowtimeDetail page` to present the statuses of the seats, plus a condition that only authenticated users can see `reserve / pay a ticket` buttons.
- Create `TicketReserve component` to include it to `ShowtimeDetail page` to let user make a reservation
- Create `TicketPay component` to include it to `ShowtimeDetail page` to make a temporary reservation (waiting for payment's confirmation) and redirect user
- Create `PaymentCreate page`, where user gets redirected, and included `BookingPresentation component`, `PaymentMethodSelector component`
---
### ✅ v0.2.0-alpha (completed on 23 June 2025; include Sprint #4)
🚀 **Features:**
- User can log in (and sign up) using personal Google account.

⚙️ **Backend:**
- Start `users` app
- Create endpoints: `POST /api/users/auth-google/`, `POST /api/users/token/verify/`, `POST /api/users/token/refresh/`

🖼️ **Frontend:**
- Create `GoogleAuth component` to include it to `Header`, and `AuthContext` to save user status (is logged in/out), tokens
---
### ✅ v0.1.0-alpha (completed on 18 June 2025; include Sprint #2, Sprint #3)
🚀 **Features:**
- User can select a cinema location, which remains saved for the entire site usage. The location can be changed at any time and helps to filter information regarding that cinema location only.
- User see on the main page a list of available movies and can select a movie from the list to load more details, including its showtimes.
- User can select a showtime to see details about, including the number of cinema theater seats in the theater where it's playing.

⚙️ **Backend:**
- Start `movies`, `locations` and `showtimes` app and migrate `Genre`, `Movie`, `City`, `Theater`, `Seat` and `Showtime` models
- Create endpoints: `GET /api/movies/`, `GET /api/movies/{id}/`, `GET /api/movies/genres/`, `GET /api/locations/cities/`, `GET /api/locations/seats/`, `GET /api/locations/theaters/`, `GET /api/locations/theaters/{id}/`, `GET /api/showtimes/`, `GET /api/showtimes/{id}/`

🖼️ **Frontend:**
- Create `Header`, `HeaderNavbar`, `Footer`, `CityContext` components to let user select their City location and save it to context
- Create `Main page` to present a movie list
- Create `MovieDetail page` to present details about user requested movie, and a list of his existing showtimes filtered by user city choice
- Create `ShowtimeDetail page` to present details about user requested showtime, and a list of the existing seats in the theater where it will take place
---
### ✅ v0.0.0-alpha (completed on 12 June 2025; include Sprint #1)
📝 **Docs:**
- Plan and document app & user workflow, initial database & endpoints design
---


## Development Notes

### 🔜 Sprint #10 (started on 9 June 2025; ended on <i>TBA</i>): "Backend & Frontend: Refactor & design"
- **About current status and next steps:** 
    - After completing the MVP (Minimum Viable Product), the next step is to systematically enhance each of the existing pages (7). This includes implementing a more user-friendly interface using Chakra UI library, completing the existing models with relevant fields, and improving overall code quality by refactoring the codebase, evaluating API endpoints, optimizing database queries, and increasing test coverage.

- **About future development methodology:** 
    - During this phase, which aligns with the beta version of the app, a new branch called `beta` will be created. The Pull Request (PR) workflow will be used to simulate working on an existing codebase that requires rework. This means starting a separate branch for each existing page and avoiding interaction with the `main` branch until the end of the sprint.
    - Since this is not a feature development phase, the work will be more iterative and less task-oriented. All specific changes and improvements will be documented in the Release Notes for version v0.8.0-beta.
---
### ✅ Sprint #9 (started on 6 June 2025; ended on 6 June 2025): "Backend & Frontend: Staff - Cashier group & showtime reporting"
- Create `UserProfile` model (extends`User` model) with field `city` (ForeignKey) to it
- Create group `Cashier`, update `PATCH /api/users/user/update/{id}/` and the workflow around it to make possible to can set the group & a `city` for user
- Update `AuthContext` & `GET /api/users/user/` to save the `city` in `user` object
- Update `StaffDashboard page` to include for `Cashier` group the next components:
    - a `Booking dashboard` that will show all `Bookings` with `status=reserved` from that `City` (data from updated `GET /api/tickets/bookings/?city={userCityId}`), with option to complete bookings (create `POST /api/tickets/reserve/complete/` to update `status=purchased`)
    - a `Showtime dashboard` that will show all `Showtimes` from that `City` (data from `GET /api/showtimes/?city={userCityId}`), their seats and status (data from `/api/showtimes/{id}/seats/`), with option to make a payment for these seats like a regular user does in `ShowtimeDetail page`
- Update `StaffDashboard page` to include for `Manager` group a `ShowtimeReport` (create `GET /api/showtime/{id}/reports/` endpoint) with analytics data (calculate tickets sold count, total revenue, and room occupancy percentage)
---
### ✅ Sprint #8 (started on 2 July 2025; ended on 3 July 2025): "Backend & Frontend: Multiple bookings & more management of their status" 
- Create `ShowtimeList page` to use `GET /api/showtimes/upcoming/?city={selectedCityId}` to group showtimes by date in chronological order
- Implement multiple seat booking functionality:
    - modify `POST /api/tickets/reserve/` & `POST /api/tickets/pay/` to accept seat_ids array: [1, 2, 3] (with maximum length for `reserve`) in order to create multiple `Booking` instances (1 per seat) for a single transaction
    - update `ShowtimeDetail page` to allow multiple seat selection using checkboxes
- Implement automatic reservation expiration functionality:
    - add `expired` status to `Booking.STATUS_CHOICES` and `expires_at` field to `Booking` model (autocompleted for `status=reserved` instances with `Showtime.time - 30 minutes` value)
    - create schedule cleanup via cron job to set `status=expired` to instances with `Booking.expired_at` past the current time
    - hide/disable reserve, pay buttons if less than 30 minutes to showtime start
- Implement payment timeout functionality:
    - update `PaymentCreate page` to include a 1 minute countdown timer to complete the payment; if not submited, fetch `POST /api/tickets/pay/timeout/` to update `Payment.status` to `declined` (`Payment.booking.status` will automatically become `failed_payment`) and inform user
    - autocomplete `expires_at` field of `Booking model` for `status=pending_payment` with value `timedate.now + 1 minute` and include in scheduled cleanup cron job
---
### ✅ Sprint #7 (started on 1 July 2025; ended on 1 July 2025): "Backend & Frontend: User profile & personal bookings"
- Create `UserProfile page` to use account info (username, group) from `AuthContext` and then the following endpoints:
	- `GET /api/users/user/{id}/bookings/` to display user's bookings history
	- `POST /api/tickets/booking/{id}/cancel/` to allow user to cancel reservation (Booking.status=canceled)
- On the same page group users staff, `Manager` & `Employee` will see a link to `StaffDashboard page`, but the access to it is password protected and groups will have the following access flow:
    - first time: since accounts are created using Google email, when groups will access link they need to set an account password using `POST /api/users/set-password/`
    - next times: they introduce the password on every session and it's get checked by `POST /api/users/verify-password/`
---
### ✅ Sprint #6 (started on 26 June 2025; ended on 29 June 2025): "Backend & Frontend - Staff dashboard & actions"
- Create groups `Manager` (can CRUD `City`, `Theater`, `Genre`, `Movie`, `Showtime` and Read `Booking`, `Payment`), `Employee` (can CRUD `Genre`, `Movie`, `Showtime`) and the following API endpoints with staff permissions: `POST api/users/promote/manager/{user_id}/`, `POST api/users/promote/employee/{user_id}/` and `POST api/users/demote/{user_id}/`
- Create, respecting the permissions of each group, API endpoints for completing the same actions each group can do
- Build `StaffDashboard page` to let staff members (staff, manager & employee) interact with above mentioned endpoints
---
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
- Fetch the above mentioned endpoint in `ShowtimeDetail page` to present the status of every seat of the theater for the specific showtime
- Set, on the previously mentioned page, for every of the newly implemented seat representation two options: reserve a seat and pay a seat 
	- Reserve a seat: fetch `POST /api/tickets/reserve/` (sending informations about `Showtime` and `Seat` objects) that will create a `Booking` instance with status=reserved and return a confirmation message afterwards
	- Pay a seat: fetch `POST /api/tickets/pay/` (sending informations about `Showtime` and `Seat` objects) that will create a `Booking` instance with status=pending_payment and redirect user to `PaymentCreate page`, where user will introduce data to `POST /api/tickets/payment/{bookingId}/`; if data is correct (condition to fail is `Payment.amount` != `Payment.booking.showtime.price`) and `Payment` status is accepted then update `Booking` status to `purchased`, else if is not, `Payment` status gonna be declined and `Booking` status will be `payment declined` (seat becomes available to be booked)
---
### ✅ Sprint #4 (started on 22 June 2025; ended on 23 June 2025): "Backend & Frontend - User authentication with Google"
- Implement signing up & logging in with Google account using OAuth2.0 and JWT, respecting the following workflow:
	- Create `users` app and `POST /api/auth/google/` endpoint to receive the `id_token` from the frontend after the user logs in with their Google account
    - Validate the `id_token` on the backend and create or retrieve the user account
    - Generate a JWT and return to the frontend to store it in `AuthContext`
    - Create `POST /api/token/verify/` to validate the token when required and `POST /api/token/refresh/` to renew access token when expires
	- Display `reserve ticket` & `buy ticket` options from `ShowtimeDetail page` to logged in users only
	- Build `logout` button to remove the token from `localStorage`
---
### ✅ Sprint #3 (started on 14 June 2025; ended on 18 June 2025): "Frontend - Movies, Locations, Showtimes"
- Build core design elements like `header`, `navbar`, `footer` to draw page layout
- Build to ensure the following user workflow: choose `City` > choose `Movie` (see `Genre`) > choose `Showtime` (see `Theater` & `Seat`):
    - `Main page`: fetch data from `GET /api/movies/` in movie grid and add link to `MovieDetails page` in every movie card
    - `MovieDetails page`: fetch data from `GET /api/movies/{id}/` to retrieve a single movie, fetch data from `GET /api/showtimes/` to list his showtimes and add link to `ShowtimeDetail page`
    - `ShowtimeDetail page`: fetch data from `GET /api/showtimes/{id}/` to retrieve a single showtime, fetch data from `GET /api/locations/theaters/{id}/` & `GET /api/locations/seats/` to retrieve his theater & seats add links to `reserve a ticket` and `buy a ticket`
---
### ✅ Sprint #2 (started on 13 June 2025; ended on 13 June 2025): "Backend - Movies, Locations, Showtimes"
- Start `movies` app and create `Movie`, `Genre`, `MovieGenre` models, alongside with the following API endpoints: `GET /api/movies/` (list all the `Movie` objects), `GET /api/genres/` (list all the `Genre` objects), `GET /api/movie/<ID>/` (detail a specific `Movie` object)
- Start `locations` app and create `City`, `Theater`, `Seat` models, alongside with the following API endpoints `GET /api/cities/` (list all the `City` objects), `GET /api/theaters/?city=<ID>` (list all the `Theater` objects linked to a specific `City` object), `GET /api/seats/?theater=<ID>` (list all the `Seat` objects linked to a specific `Theater` object)
- Start `showtimes` app and create `Showtime` model, alongside with the following API endpoints: `GET /api/showtimes/?city=<ID>&movie=<ID>` (list all the `Showtime` objects linked to a specific `City` and `Movie` objects), `GET /api/showtimes/<ID>/` (detail a specific `Showtime` object with linked `Theater` object included)
---
### ✅ Sprint #1 (started on 12 June 2025; ended on 12 June 2025): "Backend & Frontend - Project initialization"
- Configure git repository and initialize README with initial [app workflow](https://i.imgur.com/tu8nUz8.jpeg) & [database design overview]((https://i.imgur.com/mpOoMu8.png))
- Starting backend & frontend apps and installing their dependencies
- Dockerizing frontend, backend and postgresDB
---