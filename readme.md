<p align="center"><a href="https://cdn.pixabay.com/photo/2024/01/21/18/29/ai-generated-8523642_1280.png" target="_blank"><img src="https://cdn.pixabay.com/photo/2024/01/21/18/29/ai-generated-8523642_1280.png" width="400"></a></p>


# Quick Start

```bash
git clone <repo_url>

# cd into the project
cd <project_directory>

# copy environment file
cp .env.example .env

# install dependencies
pnpm install

# run docker compose
docker compose up --build
```

# Migrate

```bash
pnpm --prefix "$(git rev-parse --show-toplevel)/misc/migrator" migrate:up
```

## Super Admin Credentials
- username: ----
- password: ----


## We are ready to go.
Now visit http://localhost:4444