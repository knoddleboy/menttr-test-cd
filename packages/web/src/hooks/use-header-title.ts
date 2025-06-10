import { usePageHeaderStore } from "@/stores/page-header";
import { useEffect } from "react";

export const useHeaderTitle = (title: string | undefined) => {
  const setTitle = usePageHeaderStore((state) => state.setTitle);

  useEffect(() => {
    if (title) {
      setTitle(title);
    }
  }, [setTitle, title]);
};
