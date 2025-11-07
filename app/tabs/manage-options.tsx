import React, { useMemo, useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useItems } from "../context/ItemsContext";

export default function ManageOptionsScreen() {
  const { options, createOption, removeOption } = useItems();
  const [newOptionLabel, setNewOptionLabel] = useState("");

  const sortedOptions = useMemo(
    () => [...options].sort((a, b) => a.label.localeCompare(b.label)),
    [options]
  );

  const handleAddOption = () => {
    const trimmedLabel = newOptionLabel.trim();
    if (!trimmedLabel) {
      return;
    }

    createOption(trimmedLabel);
    setNewOptionLabel("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Options</Text>
      <Text style={styles.subtitle}>
        Configure the selectable options for your items.
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          placeholder="New option label"
          value={newOptionLabel}
          onChangeText={setNewOptionLabel}
        />
        <Pressable
          style={[styles.addButton, !newOptionLabel.trim() && styles.addButtonDisabled]}
          onPress={handleAddOption}
          disabled={!newOptionLabel.trim()}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={sortedOptions}
        keyExtractor={(item) => item.value}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.optionRow}>
            <View>
              <Text style={styles.optionLabel}>{item.label}</Text>
              <Text style={styles.optionValue}>{item.value}</Text>
            </View>
            <Pressable
              style={styles.removeButton}
              onPress={() => removeOption(item.value)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No options yet</Text>
            <Text style={styles.emptySubtitle}>
              Add a new option to make it available when creating items.
            </Text>
          </View>
        )}
      />
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
  inputRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  addButtonDisabled: {
    backgroundColor: "#b3c6ff",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 40,
  },
  separator: {
    height: 12,
  },
  optionRow: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e1e5ee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111",
  },
  optionValue: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#fee2e2",
  },
  removeButtonText: {
    color: "#dc2626",
    fontWeight: "600",
  },
  emptyState: {
    marginTop: 24,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e1e5ee",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
  },
});

