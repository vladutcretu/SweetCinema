**This branch contains the application MVP (Minimum Viable Product) with user-friendly design, cleaner, optimized, and stable API endpoints, including versions 0.8.0-beta (frontend refactor & design) and 1.0.0-beta (backend refactor & optimizing).**

# SweetCinema
SweetCinema is an open-source educational project inspired by an idea from [roadmap.sh](https://roadmap.sh/projects/movie-reservation-system) and utilizes [HappyCinema](https://www.happycinema.ro/) as a business model reference for replicating core functionalities and user flow patterns. The primary motivation was to develop a business solution that closely mirrors the selected reference model while maintaining originality in implementation.


## Table of Contents
1. [Notes](#notes)
2. [Technology stack](#technology-stack)
3. [Technical achitecture](#technical-architecture)
    - [Features](#features)
    - [Users workflow](#users-workflow)
    - [DB schema design](#db-schema-design)
    - [API endpoints design](#api-endpoints-design)
4. [Demo](#demo)
    - [Visual presentation](#visual-presentation)
    - [Local installation](#local-installation)


## Notes
Check the file [NOTES.md](NOTES.md) to see Release Notes or Development Notes. It's best way to find the app features, steps taken during development and more important, the behind thinking-process. If there's too much information for your time, below is a concise description of the technical aspects.


## Technology stack
- ⚙️ Backend: [Django REST Framework](https://www.django-rest-framework.org) with
    - 🧰 [Django ORM](https://docs.djangoproject.com/en/5.2/topics/db/queries/) for interactions with database.
    - 🐛 [Postman](https://www.postman.com), [DRF Testing](https://www.django-rest-framework.org/api-guide/testing/), [pytest-django](https://pytest-django.readthedocs.io/en/latest/) and [pytest-cov](https://pytest-cov.readthedocs.io/en/latest) for tests.
    - 🔍 [Silk](https://silk.readthedocs.io/en/latest/index.html) and [Django Debug Toolbar](https://django-debug-toolbar.readthedocs.io/en/latest/index.html) for inspecting requests and queries.
    - 📄 [DRF-spectacular](https://drf-spectacular.readthedocs.io/en/latest/) for OpenAPI documentation.
    - 🧶 [Ruff](https://docs.astral.sh/ruff/) for linting and code formatting.
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
1. **User authentication & roles**
   - Google OAuth2 login
   - JWT-based API authentication
   - Role-based access: regular user, Manager, Employee, Cashier, admin
2. **Cinema location management**
   - City & Theater CRUD by Manager
   - Auto seat generation per Theater capacity
3. **Cinema content management**
    - Movies, Genres, and Showtimes CRUD by Manager / Employee
4. **Tickets management**
   - Seat reservation (limited up to 5 seats and 30 minutes until showtime starts)
   - Seat purchase (with simulated payment)
   - History and cancelation for active reservation
   - Staff-assisted sales and completed reservation (Cashier)
5. **Reporting**
   - Report with showtime metrics for Manager: revenue, tickets sold, and occupancy rate

### Users workflow
![Users workflow](https://i.imgur.com/TqFAPnF.jpeg)

### DB schema design
![DB schema design](https://i.imgur.com/cywmtcE.png)

### API endpoints design
![API endpoints design](https://i.imgur.com/iYHytlL.png)


## Demo

### Visual presentation
Images for presentation of the application are present in the [demo directory](.demo).

### Local installation
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
   docker-compose up --build -d
   ```

4. Prepare database:
    ```sh
    docker-compose exec backend python manage.py makemigrations
    docker-compose exec backend python manage.py migrate
    docker-compose exec backend python manage.py createsuperuser
    docker-compose exec backend python manage.py loaddata populateDB.json
    ```

5. Open your web browser and navigate to:
- [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) for admin panel
- [http://127.0.0.1:8000/api/schema/swagger/](http://127.0.0.1:8000/api/schema/swagger/) for OpenAPI documentation
- [http://127.0.0.1:5173](http://127.0.0.1:5173) for frontend