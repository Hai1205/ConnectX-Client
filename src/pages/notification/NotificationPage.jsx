import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaComment, FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { deleteNotificationById, getUserNotification } from "../../utils/api/notificationApi";

const NotificationPage = () => {
	const currentUser = useSelector((state) => state.user.currentUser);
	const userId = currentUser._id;

	const getUserNoti = async () => {
		try {
			const res = await getUserNotification(userId);
			const data = res.data.notificationDTOList;

			if (res.status !== 200) {
				console.error(res);

				return [];
			}

			return data;
		} catch (error) {
			console.error(res);
		}
	};
	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: getUserNoti,
	});

	const deleteNoti = async () => {
		try {
			const res = await deleteNotificationById("");
			const data = await res.data;

			if (res.status !== 200) console.error(res);
			return data;
		} catch (error) {
			console.error(res);
		}
	};
	const { mutate: deleteNotifications } = useMutation({
		mutationFn: deleteNoti,
		onSuccess: () => {
			toast.success("Notifications deleted successfully");
			// queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p>

					<div className='dropdown '>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-4' />
						</div>

						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
						>
							<li>
								<a onClick={deleteNotifications}>Delete all notifications</a>
							</li>
						</ul>
					</div>
				</div>

				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}

				{notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}

				{notifications?.map((notification) => (
					<div className='border-b border-gray-700' key={notification._id}>
						<div className='flex gap-2 p-4'>
							{notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}

							{notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}

							{notification.type === "comment" && <FaComment className='w-7 h-7 text-blue-500' />}

							<Link to={`/profile/${notification.from.username}`}>

								<div className='avatar'>
									<div className='w-8 rounded-full'>
										<img src={notification.from.profileImg || "/public/avatar-placeholder.png"} />
									</div>
								</div>

								<div className='flex gap-1'>
									<span className='font-bold'>@{notification.from.username}</span>{" "}
									{notification.type === "follow" && "followed you"}

									{notification.type === "like" && "liked your post"}

									{notification.type === "comment" && "comment your post"}
								</div>
							</Link>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default NotificationPage;
