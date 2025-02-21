import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { followUser } from "../utils/api/usersApi";

const useFollow = () => {

	const { mutate: follow, isPending } = useMutation({
		mutationFn: async ({currentUserId, userToModifyId}) => {
			try {
				const res = await followUser(currentUserId, userToModifyId);
console.log(res);
				if (res.status !== 200) {
					console.error(res)
				}

				return;
			} catch (error) {
				console.error(error)
			}
		},
		onSuccess: () => {
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return { follow, isPending };
};

export default useFollow;
