import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateOrderStatus } from "@/actions/update-order-status";
import { adminOrdersQueryKey } from "@/hooks/queries/use-admin-orders";

export const updateOrderStatusMutationKey = () => ["update-order-status"];

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: updateOrderStatusMutationKey(),
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminOrdersQueryKey() });
    },
  });
};
