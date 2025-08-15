import { useQuery } from "@tanstack/react-query";

import { getAdminOrders } from "@/actions/get-admin-orders";

export const adminOrdersQueryKey = () => ["admin-orders"];

export const useAdminOrders = () => {
  return useQuery({
    queryKey: adminOrdersQueryKey(),
    queryFn: getAdminOrders,
  });
};
