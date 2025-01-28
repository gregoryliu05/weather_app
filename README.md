**Weather App**

REQUIREMENTS:
react, node.js

npm install
axios
dotenv
i18n-iso-countries
react-day-picker
pg 
express
cors


brew install postgresql

run: 

cd app/src, then npm run dev

cd app/backend, then npm start

I'm using a local postgresql db, to run it, change the .env file to you user login, and then run this in your postgresql client:

CREATE DATABASE your_database_name;

\c your_database_name

CREATE TABLE weather_requests (
    id SERIAL PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    weather_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
