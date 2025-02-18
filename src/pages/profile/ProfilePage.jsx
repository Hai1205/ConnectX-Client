import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";

import EditProfileModal from "./EditProfileModal";

import { formatMemberSinceDate } from "../../utils/date";
import { profileUser } from "../../utils/api/usersApi";

import useFollow from "../../hooks/useFollow";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const ProfilePage = () => {
	const [feedType, setFeedType] = useState("userPosts")
	const currentUser = useSelector((state) => state.user.currentUser);
	const { username } = useParams();

	const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();
	const { follow, isPending } = useFollow();

	const [coverImg, setCoverImg] = useState({
		showCoverImg: null,
		upCoverImg: null
	});
	const [profileImg, setProfileImg] = useState({
		showProfileImg: null,
		upProfileImg: null
	});

	const coverImgRef = useRef(null);
	const profileImgRef = useRef(null);

	const getProfile = async () => {
		try {
			const res = await profileUser(username);
			const data = res.data.user;

			if (res.status !== 200) {
				console.error(res);
			}

			return data;
		} catch (error) {
			console.error(res);
		}
	};
	const {
		data: user,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["userProfile"],
		queryFn: getProfile,
	});
	useEffect(() => {
		refetch();
	}, [username, refetch]);

	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				if (state === "coverImg") {
					setCoverImg({ showCoverImg: reader.result, upCoverImg: file });

				} else if (state === "profileImg") {
					setProfileImg({ showProfileImg: reader.result, upProfileImg: file });
				}
			};
			reader.readAsDataURL(file);
			console.log(file);
		}
	};
	
	const isMyProfile = currentUser._id === user?._id;
	const memberSinceDate = formatMemberSinceDate(user?.createdAt);
	const amIFollowing = currentUser?.followingList.includes(user?._id);
	return (
		<>
			<div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen '>
				{/* HEADER */}
				{(isLoading || isRefetching) && <ProfileHeaderSkeleton />}

				{!isLoading && !isRefetching && !user && <p className='text-center text-lg mt-4'>User not found</p>}

				<div className='flex flex-col'>
					{!isLoading && !isRefetching && user && (
						<>
							<div className='flex gap-10 px-4 py-2 items-center'>
								<Link to='/'>
									<FaArrowLeft className='w-4 h-4' />
								</Link>

								<div className='flex flex-col'>
									<p className='font-bold text-lg'>{user?.fullName}</p>

									<span className='text-sm text-slate-500'>1 posts</span>
									{/* <span className='text-sm text-slate-500'>{POSTS?.length} posts</span> */}
								</div>
							</div>

							{/* COVER IMG */}
							<div className='relative group/cover'>
								<img
									src={coverImg.showCoverImg || user?.coverImg}
									className='h-52 w-full object-cover'
									alt='cover image'
								/>

								{isMyProfile && (
									<div
										className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
										onClick={() => coverImgRef.current.click()}
									>
										<MdEdit className='w-5 h-5 text-white' />
									</div>
								)}

								<input
									type='file'
									hidden
									accept='image/*'
									ref={coverImgRef}
									onChange={(e) => handleImgChange(e, "coverImg")}
								/>

								<input
									type='file'
									hidden
									accept='image/*'
									ref={profileImgRef}
									onChange={(e) => handleImgChange(e, "profileImg")}
								/>

								{/* USER AVATAR */}
								<div className='avatar absolute -bottom-16 left-4'>
									<div className='w-32 rounded-full relative group/avatar'>
										<img src={profileImg?.showProfileImg || user?.profileImg || "/public/avatar-placeholder.png"} />

										<div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
											{isMyProfile && (
												<MdEdit
													className='w-4 h-4 text-white'
													onClick={() => profileImgRef.current.click()}
												/>
											)}
										</div>
									</div>
								</div>
							</div>

							<div className='flex justify-end px-4 mt-5'>
								{isMyProfile && <EditProfileModal currentUser={currentUser} />}

								{!isMyProfile && (
									<button
										className='btn btn-outline rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault();

											follow({ currentUserId: currentUser._id, userToModifyId: user._id });
										}}
									>
										{isPending && "Loading..."}

										{!isPending && amIFollowing && "Unfollow"}

										{!isPending && !amIFollowing && "Follow"}
									</button>
								)}

								{(coverImg.showCoverImg || profileImg.showProfileImg) && (
									<button
										className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
										onClick={async () => {
											await updateProfile({ userId: user._id, coverImg: coverImg.upCoverImg, profileImg: profileImg.upProfileImg, formData: null });
											setProfileImg({
												showProfileImg: null,
												updateProfileImg: null
											});
											setCoverImg({
												showCoverImg: null,
												upCoverImg: null
											});
										}}
									>
										{isUpdatingProfile ? "Updating..." : "Update"}
									</button>
								)}
							</div>

							<div className='flex flex-col gap-4 mt-14 px-4'>
								<div className='flex flex-col'>
									<span className='font-bold text-lg'>{user?.fullName}</span>

									<span className='text-sm text-slate-500'>@{user?.username}</span>

									<span className='text-sm my-1'>{user?.bio}</span>
								</div>

								<div className='flex gap-2 flex-wrap'>
									{user?.link && (
										<div className='flex gap-1 items-center '>
											<>
												<FaLink className='w-3 h-3 text-slate-500' />
												<a
													// href='https://youtube.com/@asaprogrammer_'
													target='_blank'
													rel='noreferrer'
													className='text-sm text-blue-500 hover:underline'
												>
													{/* Updated this after recording the video. I forgot to update this while recording, sorry, thx. */}
													{user?.link}
												</a>
											</>
										</div>
									)}

									<div className='flex gap-2 items-center'>
										<IoCalendarOutline className='w-4 h-4 text-slate-500' />

										<span className='text-sm text-slate-500'>{memberSinceDate}</span>
									</div>
								</div>

								<div className='flex gap-2'>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.followingList.length}</span>

										<span className='text-slate-500 text-xs'>Following</span>
									</div>

									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.followerList.length}</span>

										<span className='text-slate-500 text-xs'>Followers</span>
									</div>
								</div>
							</div>

							<div className='flex w-full border-b border-gray-700 mt-4'>
								<div
									className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("userPosts")}
								>
									Posts
									{feedType === "posts" && (
										<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
									)}
								</div>

								<div
									className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("likedPost")}
								>
									Likes
									{feedType === "likes" && (
										<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
									)}
								</div>
							</div>
						</>
					)}

					<Posts feedType={feedType} userId={user?._id} />
				</div>
			</div>
		</>
	);
};

export default ProfilePage;
