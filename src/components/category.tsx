import { StyleSheet, View, Text } from "react-native";

export default function Category({ name, count }: { name: string, count: number }) {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        { (name == "Today") && <Text style={styles.count}>🗓️</Text> }
        { (name == "All") && <Text style={styles.count}>🗃️</Text> }
        { (name == "Completed") && <Text style={styles.count}>✅</Text> }
        <Text style={styles.count}>{ count }</Text>
      </View>
      <Text style={styles.name}>{ name }</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c1c1e",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
  },
  top: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  name: {
    color: "#9998a0",
    fontSize: 18,
    fontWeight: "bold",
  },
  count: {
    color: '#ffffff',
    fontWeight: "bold",
    fontSize: 28
  }
})