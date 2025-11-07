import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { ItemOption, useItems } from "../context/ItemsContext";
import ItemCard from "./ItemCard";

interface ItemFormProps {
  onSubmit?: (data: { text: string; selectedOptions: ItemOption[] }) => void;
}

export default function ItemForm({ onSubmit }: ItemFormProps) {
  const { addItem, options, createOption } = useItems();
  const sortedOptions = useMemo(
    () => [...options].sort((a, b) => a.label.localeCompare(b.label)),
    [options]
  );

  const [textInput, setTextInput] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<ItemOption[]>([]);

  const isSubmitDisabled = !textInput.trim() || selectedOptions.length === 0;

  const handleSubmit = () => {
    if (isSubmitDisabled) {
      return;
    }

    const payload = {
      text: textInput.trim(),
      selectedOptions,
    };

    addItem(payload);
    onSubmit?.(payload);
    setTextInput("");
    setSelectedOptions([]);
  };

  return (
    <ItemCard
      mode="input"
      text={textInput}
      selectedOptions={selectedOptions}
      options={sortedOptions}
      onChangeText={setTextInput}
      onChangeSelectedOptions={setSelectedOptions}
      onCreateOption={createOption}
      footer={
        <Pressable
          style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitDisabled}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#b3c6ff",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

