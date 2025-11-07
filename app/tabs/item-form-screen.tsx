import { StyleSheet, Text, View } from "react-native";
import ItemForm from "../components/ItemForm";

export default function ItemFormScreen() {
  const handleSubmit = (data: { text: string; selectedOptions: { label: string; value: string }[] }) => {
    console.log("Submitted:", data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Item Form</Text>
      <Text style={styles.subtitle}>
        Create a new item by entering details and selecting an option.
      </Text>
      <ItemForm onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f7f8fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 24,
  },
});

