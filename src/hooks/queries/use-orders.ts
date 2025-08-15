import { useQuery } from "@tanstack/react-query";

import { getOrders } from "@/actions/get-orders";

export const ordersQueryKey = () => ["orders"];

export const useOrders = () => {
  return useQuery({
    queryKey: ordersQueryKey(),
    queryFn: getOrders,
  });
};
