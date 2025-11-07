import React, { ReactNode, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ItemOption, Option } from "../context/ItemsContext";

type ItemCardMode = "input" | "display" | "edit";

type ItemCardProps = {
  mode: ItemCardMode;
  text: string;
  selectedOptions: ItemOption[];
  options: Option[];
  onChangeText?: (value: string) => void;
  onChangeSelectedOptions?: (value: ItemOption[]) => void;
  onCreateOption?: (label: string) => ItemOption | Option | undefined;
  createdAt?: string;
  updatedAt?: string;
  actions?: ReactNode;
  footer?: ReactNode;
};

export default function ItemCard({
  mode,
  text,
  selectedOptions,
  options,
  onChangeText,
  onChangeSelectedOptions,
  onCreateOption,
  createdAt,
  updatedAt,
  actions,
  footer,
}: ItemCardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const sortedOptions = useMemo(
    () => [...options].sort((a, b) => a.label.localeCompare(b.label)),
    [options]
  );

  const selectedMap = useMemo(() => {
    const map = new Map<string, ItemOption>();
    selectedOptions.forEach((option) => {
      if (option.value) {
        map.set(option.value, option);
      }
    });
    return map;
  }, [selectedOptions]);

  const filteredOptions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return sortedOptions
      .filter((option) => !selectedMap.has(option.value))
      .filter((option) =>
        term ? option.label.toLowerCase().includes(term) : true
      )
      .slice(0, 10);
  }, [sortedOptions, selectedMap, searchTerm]);

  const showMetadata = mode !== "input" && (createdAt || updatedAt);
  const isEditable = mode !== "display";

  const formattedDate = (value?: string) =>
    value ? new Date(value).toLocaleString() : undefined;

  const handleSelectOption = (option: ItemOption) => {
    if (!isEditable || !onChangeSelectedOptions) {
      return;
    }

    if (selectedMap.has(option.value)) {
      setSearchTerm("");
      return;
    }

    onChangeSelectedOptions([
      ...selectedOptions,
      { value: option.value, label: option.label },
    ]);
    setSearchTerm("");
  };

  const handleRemoveOption = (value: string) => {
    if (!isEditable || !onChangeSelectedOptions) {
      return;
    }

    onChangeSelectedOptions(
      selectedOptions.filter((option) => option.value !== value)
    );
  };

  const handleSubmitSearch = () => {
    if (!isEditable) {
      return;
    }

    const term = searchTerm.trim();
    if (!term) {
      return;
    }

    const lowerTerm = term.toLowerCase();

    const exactMatch = sortedOptions.find(
      (option) =>
        option.label.toLowerCase() === lowerTerm && !selectedMap.has(option.value)
    );

    if (exactMatch) {
      handleSelectOption(exactMatch);
      return;
    }

    if (filteredOptions.length > 0) {
      handleSelectOption(filteredOptions[0]);
      return;
    }

    if (onCreateOption) {
      const created = onCreateOption(term);
      if (created && created.label && created.value) {
        handleSelectOption({ value: created.value, label: created.label });
      } else {
        setSearchTerm("");
      }
    } else {
      setSearchTerm("");
    }
  };

  const renderSelectedChips = (editable: boolean) => {
    if (!selectedOptions.length) {
      return (
        <Text style={styles.placeholderText}>
          {editable ? "Select or type options" : "No options selected"}
        </Text>
      );
    }

    return selectedOptions.map((option) => (
      <View key={option.value} style={styles.chip}>
        <Text style={styles.chipLabel}>{option.label}</Text>
        {editable && (
          <Pressable
            hitSlop={8}
            style={styles.chipRemove}
            onPress={() => handleRemoveOption(option.value)}
          >
            <Text style={styles.chipRemoveText}>✕</Text>
          </Pressable>
        )}
      </View>
    ));
  };

  const renderSelection = () => {
    if (!isEditable) {
      return <View style={styles.chipRow}>{renderSelectedChips(false)}</View>;
    }

    return (
      <View style={styles.selectionContainer}>
        <View style={styles.chipInputWrapper}>
          <View style={styles.chipRow}>{renderSelectedChips(true)}</View>
          <TextInput
            style={styles.typeaheadInput}
            placeholder={
              selectedOptions.length
                ? "Add another option"
                : "Start typing to add options"
            }
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSubmitSearch}
            blurOnSubmit={false}
            autoCorrect={false}
          />
        </View>

        {(filteredOptions.length > 0 || searchTerm.trim().length > 0) && (
          <View style={styles.suggestionsContainer}>
            {filteredOptions.length > 0 ? (
              <FlatList
                keyboardShouldPersistTaps="handled"
                data={filteredOptions}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.suggestionItem}
                    onPress={() => handleSelectOption(item)}
                  >
                    <Text style={styles.suggestionLabel}>{item.label}</Text>
                    <Text style={styles.suggestionValue}>{item.value}</Text>
                  </Pressable>
                )}
              />
            ) : (
              <Pressable
                style={styles.createSuggestion}
                onPress={handleSubmitSearch}
              >
                <Text style={styles.createSuggestionText}>
                  Create "{searchTerm.trim()}"
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardBody}>
        {isEditable ? (
          <TextInput
            style={styles.textInput}
            placeholder="Enter text here"
            value={text}
            onChangeText={onChangeText}
            multiline
          />
        ) : (
          <View style={styles.readonlyField}>
            <Text style={styles.readonlyLabel}>Text</Text>
            <Text style={styles.readonlyValue}>{text}</Text>
          </View>
        )}

        {renderSelection()}

        {showMetadata && (
          <View style={styles.metadataRow}>
            <View style={styles.metadata}>
              {createdAt && (
                <Text style={styles.metaText}>
                  Created: {formattedDate(createdAt)}
                </Text>
              )}
              {updatedAt && updatedAt !== createdAt && (
                <Text style={styles.metaText}>
                  Updated: {formattedDate(updatedAt)}
                </Text>
              )}
            </View>
            {actions && <View style={styles.actionsContainer}>{actions}</View>}
          </View>
        )}
      </View>

      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e1e5ee",
    overflow: "hidden",
  },
  cardBody: {
    padding: 20,
    gap: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  metadataRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  metadata: {
    gap: 4,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flex: 1,
  },
  metaText: {
    fontSize: 13,
    color: "#475569",
  },
  actionsContainer: {
    flexShrink: 0,
  },
  readonlyField: {
    padding: 14,
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  readonlyLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  readonlyValue: {
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "600",
  },
  readonlyMeta: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#e1e5ee",
    padding: 16,
    backgroundColor: "#f9fafb",
  },
  selectionContainer: {
    gap: 8,
  },
  chipInputWrapper: {
    borderWidth: 1,
    borderColor: "#cbd5f5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    gap: 8,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0ecff",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  chipLabel: {
    fontSize: 14,
    color: "#1e3a8a",
    fontWeight: "600",
  },
  chipRemove: {
    paddingLeft: 4,
  },
  chipRemoveText: {
    fontSize: 12,
    color: "#1e3a8a",
  },
  typeaheadInput: {
    fontSize: 15,
    paddingVertical: 6,
    color: "#0f172a",
  },
  suggestionsContainer: {
    borderWidth: 1,
    borderColor: "#cbd5f5",
    borderRadius: 10,
    backgroundColor: "#fff",
    maxHeight: 180,
    overflow: "hidden",
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eff2fb",
    gap: 4,
  },
  suggestionLabel: {
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "600",
  },
  suggestionValue: {
    fontSize: 12,
    color: "#64748b",
  },
  createSuggestion: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  createSuggestionText: {
    fontSize: 15,
    color: "#2563eb",
    fontWeight: "600",
  },
  placeholderText: {
    fontSize: 14,
    color: "#94a3b8",
  },
});

