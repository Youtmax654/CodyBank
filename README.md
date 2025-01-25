# CodyBank 🏦

Welcome to CodyBank, a modern banking application built with **FastAPI** for the backend and **React** for the frontend.

## Project Structure

The project is organized into two main directories:

- **api/**: Contains the FastAPI backend code.
- **app/**: Contains the React frontend code.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.x**: Required for the FastAPI backend.
- **Node.js** and **npm**: Required for the React frontend.

## Getting Started

Follow these steps to set up and run the project.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CodyBank
```

### 2. Initialize the Project

Run the following command to install all necessary dependencies for both the backend and frontend:

```bash
npm run init
```

This command will:

- Install Python dependencies in the `api/` directory.
- Install Node.js dependencies in the `app/` directory.

### 3. Running the Project

Start the FastAPI backend and React frontend servers using the following commands in separate terminal windows:

#### Start the FastAPI Backend

Navigate to the `api/` directory and run:

```bash
npm run api
```

#### Start the React Frontend

Navigate to the `app/` directory and run:

```bash
npm run app
```

### 4. Access the Application

Once both servers are running:

- The backend API will be available at: `http://localhost:5173/api`
- The frontend application will be available at: `http://localhost:5173`

## Project Scripts

The following npm scripts are available for convenience:

- **`npm run init`**: Installs all dependencies for both `api` and `app`.
- **`npm run api`**: Starts the FastAPI backend server.
- **`npm run app`**: Starts the React frontend server.

## Directory Details

- **`api/`**: Contains the FastAPI code, including endpoints and business logic.
  - Configuration files for Python dependencies are located here (e.g., `requirements.txt`).
- **`app/`**: Contains the React code, including components, pages, and assets.
  - Configuration files for JavaScript dependencies are located here (e.g., `package.json`).

## Contributing

We welcome contributions to CodyBank! If you'd like to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

---

Thank you for using CodyBank! If you encounter any issues or have questions, feel free to reach out.
