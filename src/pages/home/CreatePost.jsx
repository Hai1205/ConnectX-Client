import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createPost } from "../../utils/api/postsApi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const CreatePost = () => {
	const currentUser = useSelector((state) => state.user.currentUser);

	const [content, setContent] = useState("");
	const [photos, setPhotos] = useState([]);
	const imgRef = useRef(null);

	const Create = async ({ photos, content }) => {
		try {
			const res = await createPost(currentUser._id, photos, content);
			const data = await res.data.postDTOList;

			if (res.status !== 200) {
				console.error(res);
			}

			return data;
		} catch (error) {
			console.error(error);
		}
	};

	const {
		mutate: create,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: Create,
		onSuccess: () => {
			setContent("");
			setPhotos([]);
			setShowFile([]);
			toast.success("Post created successfully");
			// queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		create({ photos, content });
	};

	const [showFile, setShowFile] = useState([]);

	const handleImgChange = (e) => {
		const files = Array.from(e.target.files);

		files.forEach((file) => {
			const reader = new FileReader();
			reader.onload = () => {
				setShowFile((prevPhotos) => [...prevPhotos, reader.result]);
			};
			reader.readAsDataURL(file);
		});

		setPhotos((prevPhotos) => [...prevPhotos, ...files]);
	};

	// Xóa ảnh khỏi danh sách
	const removePhoto = (index) => {
		setShowFile(showFile.filter((_, i) => i !== index));
		setPhotos(photos.filter((_, i) => i !== index));
	};

	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<Link
						to={`/profile/${currentUser?.username}`}
						// className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
					>
						<img src={currentUser?.profileImgUrl || "/public/avatar-placeholder.png"} />
					</Link>
				</div>
			</div>

			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-0 content-lg resize-none border-none focus:outline-none border-gray-800'
					placeholder='What is happening?!'
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>

				{/* Hiển thị danh sách ảnh đã chọn */}
				{showFile.length > 0 && (
					<div className='grid grid-cols-3 gap-2'>
						{showFile.map((showFile, index) => (
							<div key={index} className='relative w-24 h-24'>
								<IoCloseSharp
									className='absolute top-0 right-0 content-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
									onClick={() => removePhoto(index)}
								/>
								<img src={showFile} className='w-full h-full object-cover rounded' />
							</div>
						))}
					</div>
				)}

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current.click()}
						/>

						<BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
					</div>

					<input type='file' accept='image/*' hidden multiple ref={imgRef} onChange={handleImgChange} />

					<button className='btn btn-primary rounded-full btn-sm content-white px-4'>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>

				{isError && <div className='content-red-500'>{error.message}</div>}
			</form>
		</div>
	);
};

export default CreatePost;
