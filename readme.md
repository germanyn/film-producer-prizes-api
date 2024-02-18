# Worst Films Recommendation

This project showcases a Node.js API with a route to find the slowest and fastest consecutive prizes owned by movie producers.

### Stack
- Node.js
- TypeScript
- Express
- REST
- TypeORM as ORM
- SQLite as file/in-memory database

### Development
- TS-Node
- Nodemon

### Testing
- Jest
- Supertest

## Project Setup

After cloning you need to create a `.env` file at the project root and you can use the content of `.env.example`.

For the database seed, you need to have a CSV import file (similar to `src/test/integration/seeds/movielist.csv`). So copy the file to `seeds` folder at the root or change `SEED_PATH` as you like. Remember that the database will be wiped every time the server starts.

Install the packages using:
```sh
npm install
```

And develop using:

```sh
npm start

# or for watch mode
npm run dev
```

Application will run on `http://localhost:6346`.

You can test the APIs using the extension `humao.rest-client` and running trough the files inside `docs/api`.

Regarding the solution to the problem, I developed two approaches:
1. `GET /producer-intervals-summary`: utilizes TypeScript
2. `GET /v2/producer-intervals-summary`: employs TypeORM QueryBuilder

The first approach, while easier to develop, debug, and maintain, is completely decoupled from the DB framework. However, it scales poorly as it brings all DB data into machine's memory and utilizes less SQL optimization from the DB manager.

On the other hand, the second approach, although more challenging and tightly coupled to the database framework, generates a single SQL query that can be optimized by the DB manager. Consequently, it runs significantly faster and avoids bringing all data to machine memory.

I've retained both approaches to showcase proficiency in both plain JS and SQL/framework skills.

## Testing

You can run the tests using

```sh
npm run test

# or for watch mode
npm run test -- --watch
```

## Routes

### GET /

**Description**: Application's health check.

**Request Parameters**:
- None

**Response**:
- Status Code: 200 OK
- Content-Type: `text/html`
- Body: `API is running`

### GET /producer-intervals-summary

**Description**: The producers with shortest or greatest interval between consecutive awards.

**Request Parameters**:
- None

**Response**:
- Status Code: 200 OK
- Content-Type: `application/json`
- Body:
```json
{
    "min": [
        {
            "producer": "Producer 1",
            "interval": 1,
            "previousWin": 2008,
            "followingWin": 2009
        },
        {
            "producer": "Producer 2",
            "interval": 1,
            "previousWin": 2018,
            "followingWin": 2019
        }
    ],
    "max": [
        {
            "producer": "Producer 1",
            "interval": 99,
            "previousWin": 1900,
            "followingWin": 1999
        },
        {
            "producer": "Producer 2",
            "interval": 99,
            "previousWin": 2000,
            "followingWin": 2099
        }
    ]
}
```

### GET /v2/producer-intervals-summary

**Description**: Same as `GET /producer-intervals-summary` but uses SQL as query solution (instead of JS script).

**Request Parameters**:
- None

**Response**:
- Status Code: 200 OK
- Content-Type: `application/json`
- Body: Same as `GET /producer-intervals-summary`

## Architecture

The project uses a mix of Layered Architecture and Component-Based Architecture.

- Core configurations are handled by `infra` folder, managing basic setups and acting as a glue between modules.

- Feature-related artifacts are organized within the `modules` folder. Each module have folders that separates concerns into:
  - `routes`: all module routers
  - `services`: all module business logics
  - `models`: all module database artifacts

Tests runs with a different variable at `.env.test`.

The application has integration tests:
- `application-integration.test.ts`: Application health check
- `movies-integration.test.ts`: Movie related routes

Additionally, there are 2 unitary tests:
- `get-shortest-and-longest-producer-win-intervals.test.ts`: use case corner case tests
- `Producer.test.ts`: database queries test
