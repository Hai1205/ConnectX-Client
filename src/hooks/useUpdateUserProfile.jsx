import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateUser } from "../utils/api/usersApi";

const useUpdateUserProfile = () => {
	const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
		mutationFn: async ({userId, coverImg, profileImg, formData}) => {
			try {
				const res = await updateUser(userId, coverImg, profileImg, formData);

				if (res.status !== 200) {
					throw new Error(res.data.error || "Something went wrong");
				}
				console.log(res)

				return res.data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;
