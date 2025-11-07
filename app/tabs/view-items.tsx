import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import ItemCard from "../components/ItemCard";
import { ItemOption, useItems } from "../context/ItemsContext";

type DraftState = {
  text: string;
  selectedOptions: ItemOption[];
};

export default function ViewItemsScreen() {
  const { items, options, updateItem, createOption } = useItems();
  const sortedOptions = useMemo(
    () => [...options].sort((a, b) => a.label.localeCompare(b.label)),
    [options]
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftState>({ text: "", selectedOptions: [] });

  const startEditing = (id: string, value: DraftState) => {
    setEditingId(id);
    setDraft(value);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraft({ text: "", selectedOptions: [] });
  };

  const handleSave = (id: string) => {
    if (!draft.text.trim() || draft.selectedOptions.length === 0) {
      return;
    }

    updateItem({ id, text: draft.text.trim(), selectedOptions: draft.selectedOptions });
    cancelEditing();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Items</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          !items.length && styles.emptyListContent,
        ]}
        renderItem={({ item }) => {
          const isEditing = editingId === item.id;

          const displayOptions = item.selectedOptions ?? [];
          const editingOptions = draft.selectedOptions;

          return (
            <ItemCard
              mode={isEditing ? "edit" : "display"}
              text={isEditing ? draft.text : item.text}
              selectedOptions={isEditing ? editingOptions : displayOptions}
              options={sortedOptions}
              createdAt={item.createdAt}
              updatedAt={item.updatedAt}
              onChangeText={
                isEditing ? (text) => setDraft((prev) => ({ ...prev, text })) : undefined
              }
              onChangeSelectedOptions={
                isEditing
                  ? (selectedOptions) => setDraft((prev) => ({ ...prev, selectedOptions }))
                  : undefined
              }
              onCreateOption={isEditing ? createOption : undefined}
              actions={
                isEditing ? (
                  <View style={styles.inlineActions}>
                    <Pressable
                      style={[styles.inlineButton, styles.inlineSecondary]}
                      onPress={cancelEditing}
                    >
                      <Text style={styles.inlineButtonText}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.inlineButton,
                        styles.inlinePrimary,
                        (!draft.text.trim() || draft.selectedOptions.length === 0) &&
                          styles.inlineButtonDisabled,
                      ]}
                      onPress={() => handleSave(item.id)}
                      disabled={!draft.text.trim() || draft.selectedOptions.length === 0}
                    >
                      <Text style={[styles.inlineButtonText, styles.inlinePrimaryText]}>Save</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    style={[styles.inlineButton, styles.inlinePrimary]}
                    onPress={() =>
                      startEditing(item.id, {
                        text: item.text,
                        selectedOptions: (item.selectedOptions ?? []).map((option) => ({
                          label: option.label,
                          value: option.value,
                        })),
                      })
                    }
                  >
                    <Text style={[styles.inlineButtonText, styles.inlinePrimaryText]}>Edit</Text>
                  </Pressable>
                )
              }
              footer={undefined}
            />
          );
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No items yet</Text>
            <Text style={styles.emptySubtitle}>
              Create a new item from the Item Form screen and it will appear here.
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
  listContent: {
    gap: 16,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  inlineActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inlineButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5f5",
    backgroundColor: "#f8fafc",
  },
  inlineButtonDisabled: {
    opacity: 0.6,
  },
  inlinePrimary: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  inlineSecondary: {
    backgroundColor: "#f8fafc",
    borderColor: "#dbeafe",
  },
  inlineButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  inlinePrimaryText: {
    color: "#fff",
  },
  emptyState: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e1e5ee",
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
});

