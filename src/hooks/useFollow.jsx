import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { followUser } from "../utils/api/usersApi";

const useFollow = () => {
	const queryClient = useQueryClient();

	const { mutate: follow, isPending } = useMutation({
		mutationFn: async (userId) => {
			try {
				const res = awaitfollowUser(userId);

				if (res.status !== 200) {
					throw new Error(res.data.error || "Something went wrong");
				}

				return;
			} catch (error) {
				throw new Error(error.message);
			}
		},
		onSuccess: () => {
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
			]);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return { follow, isPending };
};

export default useFollow;
