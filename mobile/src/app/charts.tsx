import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChartsScreen() {
  const [date, setDate] = useState("2026-04-25");
  const [trends, setTrends] = useState<any[]>([]);

  const loadTrends = () => {
    fetch(`http://10.0.2.2:8000/data/day-trends?date=${date}`)
      .then((response) => response.json())
      .then((data) => setTrends(data));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Daily Trends</Text>
        <Text style={styles.subtitle}>
          Select a date and compare hourly sensor changes.
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Date</Text>
          <TextInput value={date} onChangeText={setDate} style={styles.input} />

          <Pressable onPress={loadTrends} style={styles.button}>
            <Text style={styles.buttonText}>Load Trends</Text>
          </Pressable>
        </View>

        {trends.map((sensor) => (
          <View key={sensor.id} style={styles.chartCard}>
            <Text style={styles.chartTitle}>{sensor.name}</Text>
            <Text style={styles.chartSubtitle}>
              Hourly average / {sensor.unit}
            </Text>

            <LineChart
              data={sensor.chartData.map((item: any) => ({
                value: item.value,
                label: item.hour.slice(0, 2),
              }))}
              height={180}
              width={280}
              spacing={26}
              thickness={3}
              color="#4ADE50"
              dataPointsColor="#4ADE50"
              yAxisTextStyle={{ color: "#9CA3AF" }}
              xAxisLabelTextStyle={{ color: "#9CA3AF", fontSize: 10 }}
              xAxisColor="#1F3A3A"
              yAxisColor="#1F3A3A"
              rulesColor="#143030"
              backgroundColor="#0B1717"
            />
          </View>
        ))}

        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#020A0A" },
  container: { flex: 1, padding: 20 },

  backButton: { marginBottom: 24 },
  backText: { color: "#4ADE50", fontSize: 18, fontWeight: "700" },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "#9CA3AF",
    fontSize: 15,
    marginBottom: 20,
    lineHeight: 22,
  },

  formCard: {
    backgroundColor: "#0B1717",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#163333",
    marginBottom: 18,
  },
  label: {
    color: "#A7B0B0",
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#071111",
    color: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#143030",
  },
  button: {
    backgroundColor: "#4ADE50",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#021008",
    fontSize: 16,
    fontWeight: "800",
  },

  chartCard: {
    backgroundColor: "#0B1717",
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: "#163333",
    marginBottom: 18,
    overflow: "hidden",
  },
  chartTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  chartSubtitle: {
    color: "#9CA3AF",
    fontSize: 13,
    marginBottom: 14,
  },
});