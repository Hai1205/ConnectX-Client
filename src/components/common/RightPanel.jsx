import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import useFollow from "../../hooks/useFollow";

import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from "./LoadingSpinner";
import { suggestedUser } from "../../utils/api/usersApi";
import { useSelector } from "react-redux";

const RightPanel = () => {
	const currentUser = useSelector((state) => state.user.currentUser);
	const { follow, isPending } = useFollow();

	const getSuggested = async () => {
		try {
			if (!currentUser?._id) {
				throw new Error("User ID is undefined");
			}
			const res = await suggestedUser(currentUser._id);
			const data = res.data.userList;
			
			if (res.status !== 200) {
				console.log(res);

				return [];
			}
	
			return data;
		} catch (error) {
			console.error("Error fetching suggested users:", error);
			throw error;
		}
	};	
	const { data: suggestedUsers, isLoading } = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: getSuggested,
	});


	if (suggestedUsers?.length === 0) return <div className='md:w-64 w-0'></div>;

	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>

				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />

							<RightPanelSkeleton />

							<RightPanelSkeleton />

							<RightPanelSkeleton />
						</>
					)}

					{!isLoading &&
						suggestedUsers?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/public/avatar-placeholder.png"} />
										</div>
									</div>

									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.fullName}
										</span>
										
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>

								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault();
											
											follow({ currentUserId: currentUser._id, userToModifyId: user._id });
										}}
									>
										{isPending ? <LoadingSpinner size='sm' /> : "Follow"}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};

export default RightPanel;
