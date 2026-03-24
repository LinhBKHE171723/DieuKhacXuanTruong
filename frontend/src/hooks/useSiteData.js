import { useQuery } from "@tanstack/react-query";
import { publicApi } from "../api/publicApi";

export const useSiteSettings = () =>
  useQuery({
    queryKey: ["site-settings"],
    queryFn: publicApi.getSettings,
    staleTime: 1000 * 60 * 5
  });

export const useProductCategories = () =>
  useQuery({
    queryKey: ["product-categories"],
    queryFn: () => publicApi.getCategories({ type: "PRODUCT", limit: "all" }),
    staleTime: 1000 * 60 * 5
  });
