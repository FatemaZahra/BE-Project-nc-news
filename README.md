# Hosted URL

https://fatema-nc-news-board.herokuapp.com/api

# Pre-requisites

- Node v18.1.0
- Postgres v14.2

# Project Summary

This is a backend application built in Javascript.
Application uses MVC (Model View Controller) framework.
The application exposes REST [endpoints](/endpoints.json) which are used to perform CRUD (Create, Read, Update and Delete) operations in the postgres database.
The database consists of users, topics, articles and comments tables.
Users table stores user's data including their username, name and avatar URL.
Topics table stores the description of topic and slug.
Articles by the users are stored in the articles table and the comments on these articles are stored in the comments table.

# Instructions

## To clone a repository

Use

```
git clone https://github.com/FatemaZahra/BE-Project-nc-news.git
```

## Run commands to install dependencies

```
npm init -y
```

```
npm install -D jest
```

```
npm i pg
```

```
npm i express
```

```
npm i dotenv
```

```
npm i supertest -D
```

## Create the environment variables

Two .env files: .env.test and .env.development need to be created for the project.
Into each, PGDATABASE=<database_name_here> should be added with the correct database name for that environment.
Refer to /db/setup.sql for the database names.
**Double check that these .env files are .gitignored.**
