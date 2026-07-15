import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [sensors, setSensors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {

    const fetchSensors = () => {
      fetch("http://10.0.2.2:8000/sensors")
        .then((response) => response.json())
        .then((data) => {
          setSensors(data);
          setLastUpdated(new Date().toLocaleTimeString());
          setIsLoading(false);
        })
        .catch(() => {
          setError("Sensor data could not be loaded.");
          setIsLoading(false);
        });
    };

    fetchSensors();

    const interval = setInterval(() => {
      fetchSensors();
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        <View style={styles.header}>
          <Image
            source={require("../../assets/images/agrotech-logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome back!</Text>
          <Text style={styles.welcomeText}>Your greenhouse is running smoothly.</Text>
        </View>

        <Pressable
          style={styles.explorerCard}
          onPress={() => router.push("/explorer")}
        >
          <Text style={styles.explorerTitle}>Historical Data Explorer</Text>

          <Text style={styles.explorerText}>
            View sensor statistics by date range.
          </Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Environment Overview</Text>

        <Text style={styles.lastUpdated}>
          Last updated: {lastUpdated}
        </Text>

        {isLoading && (
          <Text style={styles.statusText}>Loading sensors...</Text>
        )}

        {error !== "" && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <View style={styles.grid}>
          {sensors.map((sensor: any) => (
            <SensorCard
              key={sensor.id}
              title={sensor.name}
              value={sensor.latestValue}
              unit={sensor.unit}
              onPress={() => {
                console.log("Clicked sensor:", sensor.id);

                router.push({
                  pathname: "/sensor/[id]",
                  params: { id: String(sensor.id) },
                });
              }}
            />
          ))}
        </View>

      </ScrollView>
      <View style={styles.bottomNav}>
        <NavItem icon="home" label="Home" active />
        <NavItem icon="bar-chart" label="Explorer" onPress={() => router.push("/explorer" as any)} />
        <NavItem icon="analytics" label="Charts" onPress={() => router.push("/charts" as any)} />
        <NavItem icon="notifications" label="Alerts" />
        <NavItem icon="menu" label="More" />
      </View>
    </SafeAreaView>
  );
}

function SensorCard({
  title,
  value,
  unit,
  onPress
}: {
  title: string;
  value: number | string | null;
  unit: string;
  onPress: () => void;
}) {
  const displayValue = value === null || value === undefined ? "--" : value;

  let iconName: any = "analytics";
  let iconColor = "#4ADE50";

  if (title.includes("TEMP")) {
    iconName = "thermometer";
    iconColor = "#FF7A59";
  }

  else if (title.includes("HUMIDITY")) {
    iconName = "water";
    iconColor = "#4DA6FF";
  }

  else if (title.includes("CO2")) {
    iconName = "leaf";
    iconColor = "#4ADE50";
  }

  else if (title.includes("RADIATION")) {
    iconName = "sunny";
    iconColor = "#FFD84D";
  }

  else if (title.includes("FLOW")) {
    iconName = "speedometer";
    iconColor = "#C084FC";
  }

  return (
    <Pressable style={styles.sensorCard} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={24} color={iconColor} />
      </View>

      <Text style={styles.sensorValue}>
        {displayValue}
        <Text style={styles.sensorUnit}> {unit}</Text>
      </Text>

      <Text style={styles.sensorTitle} numberOfLines={2}>
        {title}
      </Text>

      <Text style={styles.online}>● Online</Text>
    </Pressable>
  );
}

function NavItem({
  icon,
  label,
  active,
  onPress,
}: {
  icon: any;
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      <Ionicons
        name={icon}
        size={22}
        color={active ? "#4ADE50" : "#7A8585"}
      />
      <Text style={[styles.navText, active && styles.navTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020A0A",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 18,
  },
  logo: {
    fontSize: 34,
    fontWeight: "800",
    color: "#4ADE50",
  },
  logoWhite: {
    color: "#FFFFFF",
  },
  subtitle: {
    color: "#9CA3AF",
    marginTop: 6,
    fontSize: 14,
  },
  welcomeCard: {
    backgroundColor: "#0B1717",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#163333",
    marginBottom: 24,
  },
  welcomeTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
  },
  welcomeText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },
  statusText: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 14,
  },
  errorText: {
    color: "#FF5A5A",
    fontSize: 14,
    marginBottom: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingBottom: 30,
  },
  sensorCard: {
    width: "48%",
    backgroundColor: "#0B1717",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#143030",
  },
  sensorValue: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
    marginBottom: 8,
  },
  sensorUnit: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600",
  },
  sensorTitle: {
    color: "#A7B0B0",
    fontSize: 13,
    marginBottom: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#112020",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  online: {
    color: "#4ADE50",
    fontSize: 12,
  },
  lastUpdated: {
    color: "#4ADE50",
    fontSize: 13,
    marginBottom: 14,
  },
  explorerCard: {
    backgroundColor: "#103020",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1F5A35",
    marginBottom: 24,
  },
  explorerTitle: {
    color: "#4ADE50",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  explorerText: {
    color: "#C7D2D2",
    fontSize: 14,
  },
  bottomNav: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 16,
    height: 72,
    backgroundColor: "#071111",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#143030",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  navText: {
    color: "#7A8585",
    fontSize: 11,
    fontWeight: "600",
  },
  navTextActive: {
    color: "#4ADE50",
  },
  logoImage: {
    width: 380,
    height: 160,
  },
})