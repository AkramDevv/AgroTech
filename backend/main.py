import pickle
from fastapi import FastAPI
from datetime import datetime

app = FastAPI()

with open("greenhouse_data_clean.pkl","rb") as file:
    raw_data = pickle.load(file)

channels = raw_data["channels"]
data = raw_data["data"]

@app.get("/")
def home():
    return {"message": "AgroTech Backend Running"}

@app.get("/sensors")
def get_sensors():

    sensors = []

    for sensor_id, info in channels.items():

        readings = data.get(sensor_id, [])

        latest_value = None

        if readings:
            latest_value = readings[-1][1]

        sensors.append({
            "id": sensor_id,
            "name": info.get("name"),
            "unit": info.get("unit"),
            "latestValue": latest_value
        })

    return sensors

@app.get("/sensors/range")
def get_sensors_range(start: str, end: str):
    start_ts = int(datetime.fromisoformat(start).timestamp())
    end_ts = int(datetime.fromisoformat(end).timestamp())

    result = []

    for sensor_id, info in channels.items():
        readings = data.get(sensor_id, [])

        filtered_values = [
            value
            for timestamp, value in readings
            if start_ts <= timestamp <= end_ts
        ]

        if not filtered_values:
            continue

        result.append({
            "id": sensor_id,
            "name": info.get("name"),
            "unit": info.get("unit"),
            "count": len(filtered_values),
            "min": min(filtered_values),
            "max": max(filtered_values),
            "avg": round(sum(filtered_values) / len(filtered_values), 2),
            "latest": filtered_values[-1]
        })

    return result

@app.get("/sensors/{sensor_id}")
def get_sensor(sensor_id: int):

    info = channels.get(sensor_id)

    if not info:
        return {"error": "Sensor not found"}

    readings = data.get(sensor_id, [])

    latest_value = None

    if readings:
        latest_value = readings[-1][1]

    return {
        "id": sensor_id,
        "name": info.get("name"),
        "unit": info.get("unit"),
        "latestValue": latest_value
    }

@app.get("/sensors/{sensor_id}/history")
def get_sensor_history(sensor_id: int):

    readings = data.get(sensor_id, [])

    latest_readings = readings[-20:]

    return [
        {
            "time": item[0],
            "value": item[1]
        }
        for item in latest_readings
    ]

@app.get("/available-dates")
def get_available_dates():

    timestamps = []

    for sensor_readings in data.values():

        for timestamp, value in sensor_readings:
            timestamps.append(timestamp)

    unique_dates = sorted(
        list(
            set(
                datetime.fromtimestamp(ts).strftime("%Y-%m-%d")
                for ts in timestamps
            )
        )
    )

    return unique_dates

@app.get("/data/days")
def get_days_in_range(start: str, end: str):
    start_ts = int(datetime.fromisoformat(start + "T00:00:00").timestamp())
    end_ts = int(datetime.fromisoformat(end + "T23:59:59").timestamp())

    days = {}

    for sensor_readings in data.values():
        for timestamp, value in sensor_readings:
            if start_ts <= timestamp <= end_ts:
                day = datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d")
                hour = datetime.fromtimestamp(timestamp).strftime("%H:00")

                if day not in days:
                    days[day] = set()

                days[day].add(hour)

    return [
        {
            "date": day,
            "hours": sorted(list(hours)),
            "hourCount": len(hours)
        }
        for day, hours in sorted(days.items())
    ]

@app.get("/data/hour")
def get_hour_data(date: str, hour: int):
    start_ts = int(datetime.fromisoformat(f"{date}T{hour:02d}:00:00").timestamp())
    end_ts = int(datetime.fromisoformat(f"{date}T{hour:02d}:59:59").timestamp())

    result = []

    for sensor_id, info in channels.items():
        readings = data.get(sensor_id, [])

        values = [
            value
            for timestamp, value in readings
            if start_ts <= timestamp <= end_ts
        ]

        if not values:
            continue

        result.append({
            "id": sensor_id,
            "name": info.get("name"),
            "unit": info.get("unit"),
            "count": len(values),
            "min": min(values),
            "max": max(values),
            "avg": round(sum(values) / len(values), 2),
            "latest": values[-1]
        })

    return result

@app.get("/data/day-trends")
def get_day_trends(date: str):
    start_ts = int(datetime.fromisoformat(date + "T00:00:00").timestamp())
    end_ts = int(datetime.fromisoformat(date + "T23:59:59").timestamp())

    result = []

    for sensor_id, info in channels.items():
        info = channels.get(sensor_id)
        readings = data.get(sensor_id, [])

        hourly = {}

        for timestamp, value in readings:
            if start_ts <= timestamp <= end_ts:
                hour = datetime.fromtimestamp(timestamp).strftime("%H:00")

                if hour not in hourly:
                    hourly[hour] = []

                hourly[hour].append(value)

        chart_data = []

        for hour in sorted(hourly.keys()):
            values = hourly[hour]
            chart_data.append({
                "hour": hour,
                "value": round(sum(values) / len(values), 2)
            })

        result.append({
            "id": sensor_id,
            "name": info.get("name"),
            "unit": info.get("unit"),
            "chartData": chart_data
        })

    return result