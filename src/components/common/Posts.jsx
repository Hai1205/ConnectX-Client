import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts } from "../../utils/api/postsApi";
import { useSelector } from "react-redux";

const Posts = ({ feedType }) => {
	const currentUser = useSelector((state) => state.user.currentUser);
	const userId = currentUser._id;

	const getAllPost = async () => {
		try {
			const res = await getAllPosts();
			const data = res.data.postDTOList;

			if (res.status !== 200) {
				console.error(res);
			}

			return data;
		} catch (error) {
			console.error(res);
		}
	}

	const getFollowingPost = async () => {
		try {
			const res = await getFollowingPosts(userId);
			const data = res.data.postDTOList;

			if (res.status !== 200) {
				console.error(res);
			}

			return data;
		} catch (error) {
			console.error(res);
		}
	}

	const getUserPost = async () => {
		try {
			const res = await getUserPosts(userId);
			const data = res.data.postDTOList;

			if (res.status !== 200) {
				console.error(res);
			}

			return data;
		} catch (error) {
			console.error(res);
		}
	}

	const getLikedPost = async () => {
		try {
			const res = await getLikedPosts(userId);
			const data = res.data.postDTOList;

			if (res.status !== 200) {
				console.error(res);
			}

			return data;
		} catch (error) {
			console.error(res);
		}
	}

	const getResponse = async () => {
		switch (feedType) {
			case "forYou":
				return getAllPost();
			case "following":
				return getFollowingPost();
			case "posts":
				return getUserPost();
			case "likes":
				return getLikedPost();
			default:
				return getAllPosts();
		}
	}

	const {
		data: posts,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["posts"],
		queryFn: getResponse(),
	});

	useEffect(() => {
		refetch();
	}, [feedType, refetch, userId]);

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />

					<PostSkeleton />

					<PostSkeleton />
				</div>
			)}

			{!isLoading && !isRefetching && posts?.length === 0 && (
				<p className='text-center my-4'>No posts in this tab. Switch 👻</p>
			)}

			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};

export default Posts;
