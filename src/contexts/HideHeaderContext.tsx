import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type HideHeaderContextValue = {
  hideHeader: boolean;
  setHideHeader: (value: boolean) => void;
};

const defaultValue: HideHeaderContextValue = {
  hideHeader: false,
  setHideHeader: () => {},
};

/** When hideHeader is true, AppLayout hides the top navigation header (e.g. on "Securing arrival window" state). */
export const HideHeaderContext = createContext<HideHeaderContextValue>(defaultValue);

export function useHideHeader(): boolean {
  return useContext(HideHeaderContext).hideHeader;
}

export function useSetHideHeader(): (value: boolean) => void {
  return useContext(HideHeaderContext).setHideHeader;
}

export function HideHeaderProvider({ children }: { children: ReactNode }) {
  const [hideHeader, setHideHeader] = useState(false);
  return (
    <HideHeaderContext.Provider value={{ hideHeader, setHideHeader }}>
      {children}
    </HideHeaderContext.Provider>
  );
}
