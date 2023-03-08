# Inventory Management Frontend

## Legal
License: MIT\
Authors: Stefan Gass

### Up to release 22.06.1:
Authors: Stefan Gass & Isabella Zaby\
in cooperation with the University of Applied Sciences Burgenland, department Information Technology

## Prerequisites
    Node >= 16
    npm >= 8.11

## Get started
Install packages:
```bash
npm install
```
Compile and start frontend:
```bash
npm run build
npm start
```

## Description
Provides frontend application for managing your inventory. The UI language is german.

Works only in combination with the InventoryManagement-Backend application and MariaDB / MySQL database.


## Access the web application
When hosted on a webserver, you can access the web application under the following URL:
```
https://your.domain.net/inventory
```
...or for testing purposes:
```
http://localhost:3004/inventory
```

## Testing
Run application in dev mode:
```bash
npm run dev
```
Compile and start frontend in dev mode:
```bash
npm run buildtest
npm start
```
