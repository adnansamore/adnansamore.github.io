---
title: "Dockerizing a Python API"
dateString: 2025-08-09
tags: ["python", "docker", "flask", "api", "devops"]
draft: false
description: "How to wrap a real-world Python weather API inside a Docker container so it can run consistently on any machine or server."
showToc: true
weight: 301

---

>  **Goal:** We'll build a small Flask API that fetches live weather data, package it with Docker, and run it anywhere, without installing Python or dependencies manually.

---

## Why Docker for Python APIs?

Have you ever written a Python script and sent it to your friend, only for them to reply:

> *"It doesn’t work. I think my Python version is different."*

Docker solves this by **shipping the exact environment along with your code**.  
If it works on your machine, it works *everywhere*; local, server, or cloud.

---

##  Step 1 — Weather API

We’ll use **[OpenWeatherMap API](https://openweathermap.org/api)** for real weather data.  
Get a free API key by creating an account.

```python
# app.py
from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

API_KEY = os.getenv("OPENWEATHER_API_KEY", "your_api_key_here")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

@app.route("/weather")
def get_weather():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "Please provide a city"}), 400

    params = {"q": city, "appid": API_KEY, "units": "metric"}
    response = requests.get(BASE_URL, params=params)

    if response.status_code != 200:
        return jsonify({"error": "City not found"}), 404

    data = response.json()
    return jsonify({
        "city": data["name"],
        "temperature": data["main"]["temp"],
        "description": data["weather"][0]["description"]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```
requirements.txt:
```bash
flask
requests
```

## Step 2 — Dockerfile
```bash
# python image
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy rest of code 
COPY . .
# Run the app
CMD ["python", "app.py"]
```
## Step 3 — Build & Run in Docker
```bash
# Build image (let name it weather-api)
docker build -t weather-api .

# Run container (pass API key via env var)
docker run -p 5000:5000 -e OPENWEATHER_API_KEY=your_api_key_here weather-api
```
Test in browser or curl:

    curl "http://localhost:5000/weather?city=London"



Output:

    {
        "city": "London",
        "temperature": 18.5,
        "description": "light rain"
    }

**Docker Compose**

You can use docker-compose.yml to avoid typing long commands:
```bash
version: "3.9"
services:
  weather-api:
    build: .
    ports:
      - "5000:5000"
    environment:
      OPENWEATHER_API_KEY: your_api_key_here
```
Run with:
```bash
docker compose up
```

## Conclusion
We just:

- Built a real API in Python with Flask.

- Pulled live weather data from OpenWeatherMap.

- Packaged it into a Docker container.

- Ran it anywhere, no dependency headache.

*Always keep secrets like API keys in environment variables, never hardcode them into your code or Dockerfile.*