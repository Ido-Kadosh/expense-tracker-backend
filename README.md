# Expense Tracker Backend

[Use the site live!](https://expense-tracker-nwu0.onrender.com/)

This project serves as the backend for [Expense Tracker](https://github.com/Ido-Kadosh/expense-tracker-frontend). It handles all server-side logic, database interactions, and API services for every request.

## Prerequisites

Before you begin, make sure you have Node.js installed on your computer.

## Installing the project

To install the project, open a new terminal and type:
```
git clone https://github.com/Ido-Kadosh/expense-tracker-backend.git
cd expense-tracker-backend
npm install
```

## Running the project

To run the project locally, open terminal inside the project's folder and type:
```
npm start
```

# You will also need to populate a mongoDB collection to view data

You can do this by opening the project's folder and running
```
node scripts/populate-db.js
```

This will create a new database named "expenseTracker" and a new collection named "expense"



## API Documentation

Below is a brief documentation of the key API endpoints provided by this backend

### Get All Expenses
* **Endpoint**: `GET /api/expense`
* **Description**: Retrieves a list of all expenses in the database.
* **Parameters**:
   * `filter` (query) - a filter object to filter expenses by category, title, amount, and date.


### Get Expense by ID
* **Endpoint**: `GET /api/expense/:id`
* **Description**: Retrieves a detailed information about a specific expense by its ID.
* **Parameters**:
   * `id` (path) - the ID of the item

 
### Add New Expense
* **Endpoint**: `POST /api/expense`
* **Description**: Adds a new expense to the database.
* **Parameters**:
   * `expense` (body) - the expense to add
 

### Update Expense
* **Endpoint**: `PUT /api/expense/:id`
* **Description**: Updates an existing expense in the database.
* **Parameters**:
   * `id` (path) - the ID of the expense to update
   * `expense` (body) - the expense to update
 

### Delete Expense
* **Endpoint**: `DELETE /api/expense/:id`
* **Description**: Deletes an expense from the database.
* **Parameters**:
   * `id` (path) - the ID of the expense to delete


