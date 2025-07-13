## Parking lot API Assignment

### About This Assignment
This is a backend-only assignment using ExpressJS, TypeScript, and MySQL.

### Features
- Generate slots in a parking lot
- Generate ticket
- Leave slot
- View all status of slots
- Search slots and plat numbers by car size

### Tech Stack
- Back-end:	Node.js, Express.js, TypeScript
- Database:	MySQL
- Unit Testing:	Jest
- Container	Docker
- API Testing	Postman

## Installation & Run with Docker
### 1: Clone the repository
- git clone https://github.com/yourusername/parkinglot-assignment.git
- cd parkinglot-assignment

### 2: Build and run with Docker Compose
- docker-compose up --build
- Default API server runs on: http://localhost:3000/parking-lots/

### Test the API
- Import the provided Postman collection [`postman/ParkingLot.postman_collection.json`](./postman/parkinglot_api_assignment.postman_collection.json)
- Use example requests to test endpoints.

### API Endpoints
| Method | Endpoint                  | Description                         | Body                                            |
| ------ | ------------------------- | ----------------------------------- | ----------------------------------------------- |
| POST   | `/parking-lots/`          | Generate slots                      | `{ "capacity": 10 }`                            |
| POST   | `/tickets`                | Generate tickets                    | `{ "plate_number": "วส86", "car_size": "L"}`    |
| PATCH  | `/tickets/:slot_id`       | Leave tickets                       | -                                               |
| GET    | `/parking-lots`           | View all slots                      | -                                               |
| GET    | `/parking-lots/:slot_id`  | Search ticket                       | -                                               |
| GET    | `/tickets/:car_size`      | View all slots                      | -                                               |
