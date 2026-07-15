import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SensorDetailScreen() {
    const { id } = useLocalSearchParams();
    const [sensor, setSensor] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        fetch(`http://10.0.2.2:8000/sensors/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setSensor(data);
            });
        fetch(`http://10.0.2.2:8000/sensors/${id}/history`)
            .then((response) => response.json())
            .then((data) => {
                const chartData = data.map((item: any) => ({
                    value: item.value,
                }));

                setHistory(chartData);
            });
    }, [id]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>← Back</Text>
                </Pressable>

                <Text style={styles.title}>Sensor Detail</Text>

                <View style={styles.detailCard}>
                    <Text style={styles.sensorName}>{sensor?.name}</Text>

                    <Text style={styles.sensorValue}>
                        {sensor?.latestValue}
                        <Text style={styles.sensorUnit}> {sensor?.unit}</Text>
                    </Text>

                    <Text style={styles.online}>● Online</Text>
                </View>

                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Recent Sensor History</Text>

                    <LineChart
                        data={history}
                        height={180}
                        width={280}
                        spacing={22}
                        thickness={3}
                        color="#4ADE50"
                        hideDataPoints={false}
                        dataPointsColor="#4ADE50"
                        yAxisTextStyle={{ color: "#9CA3AF" }}
                        xAxisColor="#1F3A3A"
                        yAxisColor="#1F3A3A"
                        rulesColor="#143030"
                        backgroundColor="#0B1717"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#020A0A",
    },
    container: {
        flex: 1,
        padding: 20,
    },
    backButton: {
        marginBottom: 28,
    },
    backText: {
        color: "#4ADE50",
        fontSize: 18,
        fontWeight: "700",
    },
    title: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 20,
    },
    detailCard: {
        backgroundColor: "#0B1717",
        borderRadius: 22,
        padding: 22,
        borderWidth: 1,
        borderColor: "#163333",
    },
    sensorName: {
        color: "#A7B0B0",
        fontSize: 16,
        marginBottom: 14,
    },
    sensorValue: {
        color: "#FFFFFF",
        fontSize: 44,
        fontWeight: "800",
        marginBottom: 12,
    },
    sensorUnit: {
        color: "#9CA3AF",
        fontSize: 20,
    },
    online: {
        color: "#4ADE50",
        fontSize: 15,
    },
    chartCard: {
        backgroundColor: "#0B1717",
        borderRadius: 22,
        padding: 14,
        borderWidth: 1,
        borderColor: "#163333",
        marginTop: 18,
        overflow: "hidden",
    },
    chartTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
    },
});