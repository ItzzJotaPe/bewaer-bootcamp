import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";

export const getUserQueryKey = () => ["user"] as const;

export const useUser = () => {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  return useQuery({
    queryKey: getUserQueryKey(),
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error("No session");
      }

      const response = await fetch(`/api/user/${session.user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      return response.json();
    },
    enabled: !!session?.user?.id && !isSessionPending,
    retry: 1,
    retryDelay: 1000,
  });
};
