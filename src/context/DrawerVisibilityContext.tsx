import { createContext, useContext, useState, type ReactNode } from "react";

interface DrawerVisibilityContextType {
  isAnyDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const DrawerVisibilityContext = createContext<
  DrawerVisibilityContextType | undefined
>(undefined);

// Lets any drawer/overlay (cart, wishlist, shop categories, …) announce that
// it's open, so fixed-position UI like the floating WhatsApp button can get
// out of the way instead of overlapping the drawer's content.
export const DrawerVisibilityProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isAnyDrawerOpen, setIsAnyDrawerOpen] = useState(false);

  return (
    <DrawerVisibilityContext.Provider
      value={{ isAnyDrawerOpen, setDrawerOpen: setIsAnyDrawerOpen }}
    >
      {children}
    </DrawerVisibilityContext.Provider>
  );
};

export const useDrawerVisibility = () => {
  const ctx = useContext(DrawerVisibilityContext);
  if (!ctx) {
    throw new Error(
      "useDrawerVisibility must be used within a DrawerVisibilityProvider"
    );
  }
  return ctx;
};
