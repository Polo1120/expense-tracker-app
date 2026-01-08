import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useChartData } from "../hooks/useChartData";
import { useTheme } from "@rneui/themed";

interface DashboardChartProps {
  budgetMode: "budget" | "total_spend";
}

export const DashboardChart: React.FC<DashboardChartProps> = ({
  budgetMode,
}) => {
  const { theme } = useTheme();
  const { data, thisMonthPercentage, balance, loading, error } =
    useChartData(budgetMode);
  const screenWidth = Dimensions.get("window").width;

  const styles = StyleSheet.create({
    container: {
      marginTop: 20,
      alignItems: "center",
    },
    chartContainer: {
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.grey0,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    legendContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 10,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 10,
    },
    legendColor: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 5,
    },
    legendText: {
      color: theme.colors.grey3,
    },
    summaryContainer: {
      marginTop: 10,
      width: "100%",
      paddingHorizontal: 20,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    summaryText: {
      color: theme.colors.grey2,
      fontSize: 16,
    },
    loadingContainer: {
      height: 220,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: theme.colors.error }}>{error}</Text>
      </View>
    );
  }

  if (
    !data ||
    !data.datasets ||
    !data.datasets[0] ||
    data.datasets[0].data.every((d) => d === 0)
  ) {
    return (
      <View style={styles.container}>
        <Text style={{ color: theme.colors.grey3 }}>
          Not enough data to display chart.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          width={Math.floor(screenWidth - 32)}
          height={220}
          fromZero
          withDots={false}
          withShadow={false}
          withInnerLines={false}
          withHorizontalLines={false}
          withVerticalLines={false}
          withHorizontalLabels={false}
          chartConfig={{
            backgroundGradientFrom: theme.colors.background,
            backgroundGradientTo: theme.colors.background,
            decimalPlaces: 0,
            color: () => `rgb(197, 117, 138)`,
            labelColor: () => `rgb(97, 117, 138)`,
          }}
          bezier
          style={{
            borderRadius: 16,

          }}
        />

      </View>
      <View style={styles.legendContainer}>
        {data.legend.map((legend, i) => (
          <View key={i} style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                {
                  backgroundColor: data.datasets[i].color(1),
                },
              ]}
            />
            <Text style={styles.legendText}>{legend}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
