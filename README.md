# Inventory Management Frontend

## Legal

License: MIT\
Authors: Stefan Gass

### Up to release 22.06.1:

Authors: Stefan Gass, Isabella Zaby\
in cooperation with the University of Applied Sciences Burgenland, department Information Technology

## Prerequisites

    Node >= 20
    npm >= 10

## Description

Provides frontend application for managing your inventory, which runs on port 3004. The UI language is german.

Works only in combination with the InventoryManagement-Backend
application ( https://github.com/StefanGass/InventoryManagement-Backend ) and MariaDB database.

## Getting started

### Edit the following files

Inside the project root folder, edit the file **.env.test.local** and replace IP.OF.YOUR.TESTSERVER with the IP address
of
your testserver.

Inside the project root folder, edit the file **.env.production.local** and replace YOUR.DOMAIN.NET with your personal
domain.

Optional: Inside src/layout, edit the file **Footer.tsx** and replace YOUR COMPANY (line 41) as well as
YOUR.DOMAIN.NET (lines 44, 60 and 76) with links to your imprint, privacy policy and accessibility statement.

### Install packages:

Open a terminal session and run the following command:

```bash
npm install
```

## Compile and run the application

### Compile and start the application in production mode...

Open a terminal session and run the following command:

```bash
npm run build
npm start
```

### ...or compile and start the application in test mode...

Open a terminal session and run the following command:

```bash
npm run buildtest
npm start
```

### ...or run the application in development mode

Open a terminal session and run the following command:

```bash
npm run dev
```

## Access the web application

When hosted on a webserver and compiled in production mode, you can access the web application under the following URL:

```
https://YOUR.DOMAIN.NET/inventory
```

When hosted on a webserver and compiled in test mode, you can access the web application under the following URL:

```
https://IP.OF.YOUR.TESTSERVER:3004/inventory
```

When run in development mode, the application can be accessed locally under the following URL:

```
http://localhost:3004/inventory
```
