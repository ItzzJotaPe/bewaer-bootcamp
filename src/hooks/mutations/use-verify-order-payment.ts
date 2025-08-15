import { useMutation, useQueryClient } from "@tanstack/react-query";

import { verifyOrderPayment } from "@/actions/verify-order-payment";

export const verifyOrderPaymentMutationKey = (orderId: string) => [
  "verify-order-payment",
  orderId,
];

export const useVerifyOrderPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyOrderPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });
    },
  });
};
