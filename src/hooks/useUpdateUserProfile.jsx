import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateUser } from "../utils/api/usersApi";
import { useDispatch } from "react-redux";
import { logInSuccess } from "../redux/slice/userSlice";

const useUpdateUserProfile = () => {
	const dispatch = useDispatch();

	const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
		mutationFn: async ({ userId, coverImg, profileImg, formData }) => {
			try {
				const res = await updateUser(userId, coverImg, profileImg, formData);
				console.log(res);
				const data = res.data.user;

				if (res.status !== 200) {
					throw new Error(res.data.error || "Something went wrong");
				}

				dispatch(logInSuccess(data));
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
