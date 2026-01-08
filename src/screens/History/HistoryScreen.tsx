import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme, Icon, ListItem } from "@rneui/themed";
import { useHistory } from "../../hooks/useHistory";
import { EXPENSE_CATEGORIES } from "../../constants/categories";
import { Expense } from "../../types";

const FILTER_TABS = [
    { label: "Total", value: "all" },
    { label: "Expense", value: "expense" },
    { label: "Income", value: "income" },
] as const;

export default function HistoryScreen() {
    const { theme } = useTheme();
    const { transactions, loading, filter, setFilter, refresh } = useHistory();

    const getCategoryIcon = (category: string) => {
        // @ts-ignore
        const cat = EXPENSE_CATEGORIES[category];
        return cat ? cat.icon : "help-circle"; // material community icon name
    };

    const renderItem = ({ item }: { item: Expense }) => {
        const isExpense = item.type === "expense";
        const amountColor = isExpense ? theme.colors.error : theme.colors.success;
        const sign = isExpense ? "-" : "+";

        return (
            <ListItem
                key={item.id}
                containerStyle={{
                    backgroundColor: theme.colors.background,
                    marginHorizontal: 16,
                    marginVertical: 4,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.colors.grey0
                }}
                bottomDivider={false}
            >
                <>
                    <View style={[styles.iconContainer, { backgroundColor: theme.colors.grey0 }]}>
                        <Icon
                            name={getCategoryIcon(item.category || "")}
                            type="material-community"
                            color={isExpense ? theme.colors.adaptiveColor : theme.colors.success}
                            size={24}
                        />
                    </View>

                    <ListItem.Content>
                        <ListItem.Title style={{ color: theme.colors.adaptiveColor, fontFamily: "Inter-Medium", fontSize: 16, paddingLeft: 16 }}>
                            {item.name || item.category || "Transaction"}
                        </ListItem.Title>
                        <ListItem.Subtitle style={{ color: theme.colors.grey3, fontSize: 12, marginTop: 4, paddingLeft: 16 }}>
                            {item.date ? new Date(item.date).toLocaleDateString() : ""}
                        </ListItem.Subtitle>
                    </ListItem.Content>

                    <Text style={{ color: theme.colors.adaptiveColor, fontSize: 16 }}>
                        {sign}${item.amount.toFixed(2)}
                    </Text>
                </>
            </ListItem>
        );
    };


    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                {FILTER_TABS.map((tab) => {
                    const isActive = filter === tab.value;
                    return (
                        <TouchableOpacity
                            key={tab.value}
                            onPress={() => setFilter(tab.value)}
                            style={[
                                styles.tab,
                                {
                                    backgroundColor: isActive ? theme.colors.primary : 'transparent',
                                    borderColor: theme.colors.grey0
                                }
                            ]}
                        >
                            <Text style={{
                                color: isActive ? theme.colors.white : theme.colors.grey2,
                                fontWeight: "600"
                            }}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </View>

            {/* List */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={transactions}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={{ color: theme.colors.grey3 }}>No transactions found</Text>
                        </View>
                    }
                    onRefresh={refresh}
                    refreshing={loading}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filterContainer: {
        flexDirection: "row",
        padding: 16,
        justifyContent: "space-between",
    },
    tab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        marginHorizontal: 4,
        borderRadius: 8,
        borderWidth: 1,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
