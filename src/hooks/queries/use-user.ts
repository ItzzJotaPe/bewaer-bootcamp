import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";

export const getUserQueryKey = () => ["user"];

export const useUser = () => {
  const { data: session } = authClient.useSession();
  
  return useQuery({
    queryKey: getUserQueryKey(),
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const response = await fetch(`/api/user/${session.user.id}`);
      if (!response.ok) throw new Error("Failed to fetch user");
      
      return response.json();
    },
    enabled: !!session?.user?.id,
  });
};
