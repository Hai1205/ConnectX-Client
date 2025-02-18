import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";
import { useSelector } from "react-redux";
import { deletePost, likePost } from "../../utils/api/postsApi";
import { createComemnt } from "../../utils/api/commentApi";
import { IoCloseSharp } from "react-icons/io5";

const Post = ({ post }) => {
	const currentUser = useSelector((state) => state.user.currentUser);
	const userId = currentUser._id;

	const [text, setText] = useState("")
	const [img, setImg] = useState({
		showImg: null,
		upImg: null
	});
	const queryClient = useQueryClient();
	const postOwner = post.user;
	const isLiked = post.likeList.includes(userId);
	const isMyPost = userId === post.user._id;
	const formattedDate = formatPostDate(post.createdAt);

	const { mutate: DeletePost, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await deletePost(post._id);
				const data = await res.data;

				if (res.status !== 200) {
					console.error(res);
				}
				return data;
			} catch (error) {
				console.error(res);
			}
		},
		onSuccess: () => {
			toast.success("Post deleted successfully");
		},
	});

	const { mutate: LikePost, isPending: isLiking } = useMutation({
		mutationFn: async () => {
			try {
				const res = await likePost(userId, post._id);
				const data = await res.data;

				if (res.status !== 200) {
					console.error(res);
				}

				return data;
			} catch (error) {
				console.error(res);
			}
		},
		onSuccess: (updatedLikes) => {
			// this is not the best UX, bc it will refetch all posts
			// queryClient.invalidateQueries({ queryKey: ["posts"] });

			// instead, update the cache directly for that post
			queryClient.setQueryData(["posts"], (oldData) => {
				return oldData.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: updatedLikes };
					}
					return p;
				});
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { mutate: commentPost, isPending: isCommenting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await createComemnt(post._id, userId, text, img);
				const data = await res.data;
				console.log(res)

				if (res.status !== 200) {
					console.error(res);
				}

				return data;
			} catch (error) {
				console.error(error);
			}
		},
		onSuccess: () => {
			toast.success("Comment posted successfully");
			setText("");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => {
			console.log(error)
			toast.error(error.message);
		},
	});

	const handleDeletePost = () => {
		DeletePost();
	};

	const handlePostComment = (e) => {
		e.preventDefault();

		if (isCommenting) return;

		commentPost();
	};

	const handleLikePost = () => {
		if (isLiking) return;

		LikePost();
	};

	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg({ showImg: reader.result, upImg: file });
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<>
			<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
				<div className='avatar'>
					<Link to={`/profile/${postOwner.username}`} className='w-8 rounded-full overflow-hidden'>
						<img src={postOwner.profileImg || "/public/avatar-placeholder.png"} />
					</Link>
				</div>

				<div className='flex flex-col flex-1'>
					<div className='flex gap-2 items-center'>
						<Link to={`/profile/${postOwner.username}`} className='font-bold'>
							{postOwner.fullName}
						</Link>

						<span className='text-gray-700 flex gap-1 text-sm'>
							<Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>

							<span>·</span>

							<span>{formattedDate}</span>
						</span>

						{isMyPost && (
							<span className='flex justify-end flex-1'>
								{!isDeleting && (
									<FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />
								)}

								{isDeleting && <LoadingSpinner size='sm' />}
							</span>
						)}
					</div>

					<div className='flex flex-col gap-3 overflow-hidden'>
						<span>{post.text}</span>

						{post.imageList && post.imageList.map((img, index) => (
							<div key={index} className='relative w-24 h-24'>
								<img src={img} className='w-full h-full object-cover rounded' />
							</div>
						))}
					</div>

					<div className='flex justify-between mt-3'>
						<div className='flex gap-4 items-center w-2/3 justify-between'>
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />

								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{post.commentList.length}
								</span>
							</div>

							{/* We're using Modal Component from DaisyUI */}
							<dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
								<div className='modal-box rounded border border-gray-600'>
									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>

									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{post.commentList.length === 0 && (
											<p className='text-sm text-slate-500'>
												No comments yet 🤔 Be the first one 😉
											</p>
										)}

										{post.commentList.map((comment) => (
											<div key={comment._id} className='flex gap-2 items-start'>
												<div className='avatar'>
													<div className='w-8 rounded-full'>
														<img
															src={comment.userProfileImg || "/public/avatar-placeholder.png"}
														/>
													</div>
												</div>

												<div className='flex flex-col'>
													<div className='flex items-center gap-1'>
														<span className='font-bold'>{comment.userFullName}</span>

														<span className='text-gray-700 text-sm'>
															@{comment.username}
														</span>
													</div>

													<div className='text-sm'>{comment.text}</div>

													{comment.img && (<img src={comment.img} className='w-full h-full object-cover rounded' />)}
												</div>
											</div>
										))}
									</div>

									<form
										className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
										onSubmit={handlePostComment}
									>
										<textarea
											className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
											placeholder='Add a comment...'
											value={text}
											onChange={(e) => setText(e.target.value)}
										/>
										<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
											{isCommenting ? <LoadingSpinner size='md' /> : "Post"}
										</button>
									</form>
								</div>

								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>

							<div className='flex gap-1 items-center group cursor-pointer'>
								<BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
								<span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
							</div>

							<div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
								{isLiking && <LoadingSpinner size='sm' />}

								{!isLiked && !isLiking && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}

								{isLiked && !isLiking && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />
								)}

								<span
									className={`text-sm  group-hover:text-pink-500 ${isLiked ? "text-pink-500" : "text-slate-500"
										}`}
								>
									{post.likeList.length}
								</span>
							</div>
						</div>

						<div className='flex w-1/3 justify-end gap-2 items-center'>
							<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Post;
