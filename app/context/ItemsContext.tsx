import React, {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

type ItemOption = {
  value: string;
  label: string;
};

type Item = {
  id: string;
  text: string;
  selectedOptions: ItemOption[];
  createdAt: string;
  updatedAt: string;
};

type Option = {
  label: string;
  value: string;
};

type AddItemPayload = {
  text: string;
  selectedOptions: ItemOption[];
};

type UpdateItemPayload = {
  id: string;
  text: string;
  selectedOptions: ItemOption[];
};

type ItemsContextValue = {
  items: Item[];
  options: Option[];
  addItem: (payload: AddItemPayload) => void;
  createOption: (label: string) => Option | undefined;
  removeOption: (value: string) => void;
  updateItem: (payload: UpdateItemPayload) => void;
};

const ItemsContext = createContext<ItemsContextValue | undefined>(undefined);

const DEFAULT_OPTIONS: Option[] = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [options, setOptions] = useState<Option[]>(DEFAULT_OPTIONS);

  const addItem = useCallback(
    ({ text, selectedOptions }: AddItemPayload) => {
      const sanitizedText = text.trim();
      if (!sanitizedText) {
        return;
      }

      const dedupedOptions = selectedOptions.reduce<ItemOption[]>((acc, option) => {
        if (!option.value || !option.label) {
          return acc;
        }
        if (acc.some((existing) => existing.value === option.value)) {
          return acc;
        }
        return [...acc, { value: option.value, label: option.label }];
      }, []);

      const timestamp = new Date().toISOString();

      setItems((current) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          text: sanitizedText,
          selectedOptions: dedupedOptions,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        ...current,
      ]);
    },
    []
  );

  const createOption = useCallback(
    (label: string) => {
      const trimmedLabel = label.trim();
      if (!trimmedLabel) {
        return undefined;
      }

      const existing = options.find(
        (option) => option.label.toLowerCase() === trimmedLabel.toLowerCase()
      );
      if (existing) {
        return existing;
      }

      let baseValue = slugify(trimmedLabel);
      if (!baseValue) {
        baseValue = `option-${Date.now()}`;
      }

      let uniqueValue = baseValue;
      let counter = 1;
      while (options.some((option) => option.value === uniqueValue)) {
        uniqueValue = `${baseValue}-${counter++}`;
      }

      const newOption: Option = { label: trimmedLabel, value: uniqueValue };
      setOptions((current) => [...current, newOption]);
      return newOption;
    },
    [options]
  );

  const removeOption = useCallback((value: string) => {
    setOptions((current) => current.filter((option) => option.value !== value));
    setItems((current) =>
      current.map((item) => ({
        ...item,
        selectedOptions: item.selectedOptions.filter(
          (option) => option.value !== value
        ),
      }))
    );
  }, []);

  const updateItem = useCallback(
    ({ id, text, selectedOptions }: UpdateItemPayload) => {
      const sanitizedText = text.trim();
      if (!sanitizedText) {
        return;
      }

      const dedupedOptions = selectedOptions.reduce<ItemOption[]>((acc, option) => {
        if (!option.value || !option.label) {
          return acc;
        }
        if (acc.some((existing) => existing.value === option.value)) {
          return acc;
        }
        return [...acc, { value: option.value, label: option.label }];
      }, []);

      setItems((current) => {
        return current.map((item) =>
          item.id === id
            ? {
                ...item,
                text: sanitizedText,
                selectedOptions: dedupedOptions,
                updatedAt: new Date().toISOString(),
              }
            : item
        );
      });
    },
    []
  );

  const value = useMemo(
    () => ({ items, options, addItem, createOption, removeOption, updateItem }),
    [items, options, addItem, createOption, removeOption, updateItem]
  );

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error("useItems must be used within an ItemsProvider");
  }
  return context;
}

export type { Item, ItemOption, Option, UpdateItemPayload };

