# SweetCinema
SweetCinema is an open-source educational project inspired by an idea from [roadmap.sh](https://roadmap.sh/projects/movie-reservation-system) and using [HappyCinema](https://www.happycinema.ro/) as a muse for features and design. 


## Table of Contents
1. [Notes](#notes)
2. [Technology stack](#technology-stack)
3. [Technical achitecture](#technical-architecture)
    - [User workflow](#user-workflow)
    - [DB schema design](#db-schema-design)
4. [Local installation](#local-installation)


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
    ```

3. Build and run the containers:
   ```sh
   docker-compose up --build
   ```
   - See if all 3 containers are running:
        ```sh
        docker-compose ps 
        ```
    - If not all containers are running, start the missing one:
        ```sh
        docker-compose start <postgres/backend/frontend>
        ```

4. Open your web browser and navigate to:
- [http://127.0.0.1:8000](http://127.0.0.1:8000) for backend
- [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) for admin panel
- [http://127.0.0.1:5173](http://127.0.0.1:5173) for frontend
