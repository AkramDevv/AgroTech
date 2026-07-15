import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExplorerScreen() {
  const [start, setStart] = useState("2026-04-20");
  const [end, setEnd] = useState("2026-04-26");
  const [days, setDays] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [hourData, setHourData] = useState<any[]>([]);

  const loadDays = () => {
    fetch(`http://10.0.2.2:8000/data/days?start=${start}&end=${end}`)
      .then((response) => response.json())
      .then((data) => {
        setDays(data);
        setSelectedDate("");
        setSelectedHour("");
        setHourData([]);
      });
  };

  const loadHourData = (date: string, hourText: string) => {
    const hour = Number(hourText.split(":")[0]);

    setSelectedDate(date);
    setSelectedHour(hourText);

    fetch(`http://10.0.2.2:8000/data/hour?date=${date}&hour=${hour}`)
      .then((response) => response.json())
      .then((data) => {
        setHourData(data);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Historical Data Explorer</Text>
        <Text style={styles.subtitle}>
          Select a date range, open a day, then choose an hour to view sensor data.
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Start Date</Text>
          <TextInput value={start} onChangeText={setStart} style={styles.input} />

          <Text style={styles.label}>End Date</Text>
          <TextInput value={end} onChangeText={setEnd} style={styles.input} />

          <Pressable onPress={loadDays} style={styles.button}>
            <Text style={styles.buttonText}>Load Days</Text>
          </Pressable>
        </View>

        {days.map((day) => (
          <View key={day.date} style={styles.dayCard}>
            <Text style={styles.dayTitle}>{day.date}</Text>
            <Text style={styles.dayMeta}>{day.hourCount} hours with data</Text>

            <View style={styles.hoursGrid}>
              {day.hours.map((hour: string) => (
                <Pressable
                  key={`${day.date}-${hour}`}
                  style={[
                    styles.hourChip,
                    selectedDate === day.date &&
                      selectedHour === hour &&
                      styles.hourChipActive,
                  ]}
                  onPress={() => loadHourData(day.date, hour)}
                >
                  <Text
                    style={[
                      styles.hourText,
                      selectedDate === day.date &&
                        selectedHour === hour &&
                        styles.hourTextActive,
                    ]}
                  >
                    {hour}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        {hourData.length > 0 && (
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              Data for {selectedDate} at {selectedHour}
            </Text>
            <Text style={styles.resultsSubtitle}>
              {hourData.length} sensor records found
            </Text>
          </View>
        )}

        {hourData.map((item) => (
          <View key={item.id} style={styles.resultCard}>
            <Text style={styles.sensorName}>{item.name}</Text>

            <Text style={styles.latest}>
              {item.latest} <Text style={styles.unit}>{item.unit}</Text>
            </Text>

            <Text style={styles.meta}>
              Avg: {item.avg} | Min: {item.min} | Max: {item.max}
            </Text>

            <Text style={styles.meta}>Records in this hour: {item.count}</Text>
          </View>
        ))}

        <View style={{ height: 80 }} />
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
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
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
    marginTop: 4,
  },
  buttonText: {
    color: "#021008",
    fontSize: 16,
    fontWeight: "800",
  },

  dayCard: {
    backgroundColor: "#0B1717",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#143030",
    marginBottom: 14,
  },
  dayTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  dayMeta: {
    color: "#4ADE50",
    fontSize: 13,
    marginBottom: 12,
  },
  hoursGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  hourChip: {
    backgroundColor: "#071111",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#143030",
  },
  hourChipActive: {
    backgroundColor: "#4ADE50",
    borderColor: "#4ADE50",
  },
  hourText: {
    color: "#C7D2D2",
    fontSize: 12,
    fontWeight: "700",
  },
  hourTextActive: {
    color: "#021008",
  },

  resultsHeader: {
    marginTop: 10,
    marginBottom: 12,
  },
  resultsTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  resultsSubtitle: {
    color: "#9CA3AF",
    fontSize: 13,
  },

  resultCard: {
    backgroundColor: "#0B1717",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#143030",
    marginBottom: 12,
  },
  sensorName: {
    color: "#A7B0B0",
    fontSize: 14,
    marginBottom: 8,
  },
  latest: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  unit: {
    color: "#9CA3AF",
    fontSize: 16,
  },
  meta: {
    color: "#9CA3AF",
    fontSize: 13,
    marginBottom: 4,
  },
});