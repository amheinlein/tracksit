import { Drawer } from "expo-router/drawer";
import { ItemsProvider } from "./context/ItemsContext";

export default function RootLayout() {
  return (
    <ItemsProvider>
      <Drawer>
        <Drawer.Screen
          name="tabs/item-form-screen"
          options={{ title: "Item Form", drawerLabel: "Item Form" }}
        />
        <Drawer.Screen
          name="tabs/manage-options"
          options={{ title: "Manage Options", drawerLabel: "Manage Options" }}
        />
        <Drawer.Screen
          name="tabs/view-items"
          options={{ title: "View Items", drawerLabel: "View Items" }}
        />
      </Drawer>
    </ItemsProvider>
  );
}
