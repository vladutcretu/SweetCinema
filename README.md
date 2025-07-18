# SweetCinema
SweetCinema is an open-source educational project inspired by an idea from [roadmap.sh](https://roadmap.sh/projects/movie-reservation-system) and utilizes [HappyCinema](https://www.happycinema.ro/) as a business model reference for replicating core functionalities and user flow patterns. The primary motivation was to develop a business solution that closely mirrors the selected reference model while maintaining originality in implementation.


## Table of Contents
1. [Notes](#notes)
2. [Technology stack](#technology-stack)
3. [Technical achitecture](#technical-architecture)
    - [Features](#features)
    - [User workflow](#user-workflow)
    - [DB schema design](#db-schema-design)
4. [Local installation](#local-installation)


## Notes
Check the file [NOTES.md](NOTES.md) to see Release Notes or Development Notes. It's best way to find the app features, steps taken during development and more important, the behind thinking-process. If there's too much information for your time, below is a concise description of the technical aspects.

## Technology stack
- ⚙️ Backend: [Django REST Framework](https://www.django-rest-framework.org) with
    - 🧰 [Django ORM](https://docs.djangoproject.com/en/5.2/topics/db/queries/) for interactions with database.
    - 🐛 [Django unittest](https://docs.djangoproject.com/en/5.1/topics/testing/overview/), [DRF Testing](https://www.django-rest-framework.org/api-guide/testing/) and [Postman](https://www.postman.com) for tests.
    - 🧶 [Ruff](https://docs.astral.sh/ruff/) for linting and code formatting.
    - 📄 [DRF-spectacular](https://drf-spectacular.readthedocs.io/en/latest/) for OpenAPI documentation.
- 💾 Database: [PostgresQL](https://www.postgresql.org/).
- 🖼️ Frontend: [ReactJS](https://react.dev/) and [Vite](https://vite.dev) with
    - ⚡ [Chakra UI](https://chakra-ui.com) for designing components.
    - 🧲 [Axios](https://axios-http.com/) for fetching data.
- 🧩Other tools:
    - 🗓️ [Jira](https://www.atlassian.com/software/jira) for planning work.
    - 🐋 [Docker Compose](https://www.docker.com/) for local development.
    - 🔐[@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google), [google-auth](https://pypi.org/project/google-auth/) and [djangorestframework-simplejwt](https://pypi.org/project/djangorestframework-simplejwt/) for authentication and authorization with Google OAuth2.0 and JWT.
    - 🥬[Celery](https://docs.celeryq.dev/en/stable/index.html), with [Redis](https://pypi.org/project/redis/) as broker/backend, and [django-celery-beat](https://django-celery-beat.readthedocs.io/en/latest/) for scheduling tasks.
    


## Technical architecture

### Features 
1. User authentication & roles: 
    - Signup & Login: using personal Google account
    - JWT-based authentication: secure access to the API endpoints using JSON Web Tokens
    - User Roles: `regular user`, `admin`, `Manager`, `Employee`, `Cashier`
2. City, Theater, Seat management: 
    - `Manager` can create, read, update, and delete locations
    - Other roles can interact with these entities depending on their permissions
3. Movie, Genre, Showtime management:
    - `Manager` & `Employee` can create, read, update, and delete entries
    - All users can view these entries.
4. Tickets Reservation / Purchasing management: 
    - `regular user` can view all seats for a specific showtime, reserve / purchase seats, view their upcoming / past tickets and cancel active reservations
    - `Cashier` can view all reservations within their assigned city, complete reservations and sell tickets to walk-in customers
5. Reporting: `Manager` can generate reports for a showtime, including total tickets sold & revenue

### Users workflow
![Users workflow](https://i.imgur.com/TqFAPnF.jpeg)

### DB schema design
![DB schema design](https://i.imgur.com/yLJjfqx.png)


## Local installation
1. Clone the repository and navigate into the project folder:
   ```sh
   git clone https://github.com/vladutcretu/SweetCinema.git
   cd SweetCinema
   ```
2. Create a `.env` file in the SweetCinema root with the following content:
    ```sh
    DB_NAME=your_db_name         # Name of the Postgres database
    DB_USER=your_username        # Postgres username
    DB_PASSWORD=your_password    # Postgres password
    DB_HOST=db                   # Don't edit to match the Postgres service name from docker-compose
    DB_PORT=5432                 # Don't edit to match default Postgres port

    GOOGLE_CLIENT_ID=your_app_client_id # Read https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid
    GOOGLE_CLIENT_SECRET=your_app_client_secret # Copy from the same place as client_id

    VITE_API_URL=http://127.0.0.1:8000/api
    VITE_GOOGLE_CLIENT_ID=your_app_client_id # Same value as the GOOGLE_CLIENT_ID variable
    ```

3. Build and run the containers:
   ```sh
   docker-compose up --build
   ```

4. Open your web browser and navigate to:
- [http://127.0.0.1:8000](http://127.0.0.1:8000) for backend
- [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) for admin panel
- [http://127.0.0.1:5173](http://127.0.0.1:5173) for frontend
