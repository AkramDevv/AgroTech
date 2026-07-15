# 🌱 AgroTech - Smart Greenhouse Monitoring System

AgroTech is a full-stack greenhouse monitoring system developed with **React Native** and **FastAPI**. The application allows users to monitor greenhouse sensors, explore historical environmental data, and visualize sensor trends through interactive charts.

## 🚀 Features

- Real-time greenhouse sensor dashboard
- Sensor detail page with history chart
- Historical data explorer
- Date range and hour filtering
- Daily sensor trend visualization
- REST API integration
- Modern mobile UI

## 🛠 Technologies

### Mobile
- React Native
- Expo
- Expo Router
- TypeScript
- React Native Gifted Charts

### Backend
- Python
- FastAPI
- Uvicorn
- Pickle (.pkl)
- JSON

## 📂 Project Structure

```
AgroTech/
│
├── mobile/      # React Native application
├── backend/     # FastAPI server
└── README.md
```

## ⚙️ Backend Setup

```bash
cd backend

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at:

```
http://127.0.0.1:8000
```

API Documentation:

```
http://127.0.0.1:8000/docs
```

## 📱 Mobile Setup

```bash
cd mobile

npm install

npm run android
```

For iOS:

```bash
npm run ios
```

## 🔗 Backend Connection

Android Emulator:

```
http://10.0.2.2:8000
```

iOS Simulator:

```
http://127.0.0.1:8000
```

(For a real device, replace the URL with your computer's local IP address.)

## 📊 Dataset

The backend processes a greenhouse dataset stored as a **Pickle (.pkl)** file containing historical environmental sensor measurements, including:

- Temperature
- Humidity
- CO₂
- Radiation
- Water Temperature
- Gas Consumption
- Flow Rate
- Ventilation
- Curtain Position
- Boiler Data
- Additional greenhouse parameters

The dataset is parsed by the backend and exposed through REST APIs for the mobile application.

## 👨‍💻 Author

**Akram Huseynli**

Azerbaijan University  
Information Technologies

GitHub:

https://github.com/AkramDevv