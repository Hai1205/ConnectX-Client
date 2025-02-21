import XSvg from "../svgs/X";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaBookmark, FaSearch, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { logOutSuccess } from "../../redux/slice/userSlice";
import { logoutUser } from "../../utils/api/authApi";
import { FaMessage } from "react-icons/fa6";

const Sidebar = () => {
	const currentUser = useSelector((state) => state.user.currentUser);
	const dispatch = useDispatch();

	const logOut = async () => {
		try {
			const res = await logoutUser();

			if (res.status !== 200) {
				console.error(res);
			}
		} catch (error) {
			console.log(error)
			console.error(res);
		}
	};
	const { mutate: logout } = useMutation({
		mutationFn: logOut,
		onSuccess: () => {
			dispatch(logOutSuccess());
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});
	return (
		<div className='md:flex-[2_2_0] w-18 max-w-52'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
				<Link to='/' className='flex justify-center md:justify-start'>
					<XSvg className='px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900' />
				</Link>

				<ul className='flex flex-col gap-3 mt-4'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<MdHomeFilled className='w-8 h-8' />

							<span className='text-lg hidden md:block'>Home</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to='/bookmarks'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaBookmark className='w-6 h-6' />

							<span className='text-lg hidden md:block'>Bookmarks</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to='/search'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaSearch className='w-6 h-6' />

							<span className='text-lg hidden md:block'>Search</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-6 h-6' />

							<span className='text-lg hidden md:block'>Notifications</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to='/messages'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaMessage className='w-6 h-6' />

							<span className='text-lg hidden md:block'>Messages</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${currentUser?.username}`}
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaUser className='w-6 h-6' />

							<span className='text-lg hidden md:block'>Profile</span>
						</Link>
					</li>
				</ul>

				{currentUser && (
					<Link
						to={`/profile/${currentUser?.username}`}
						className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full'
					>
						<div className='avatar hidden md:inline-flex'>
							<div className='w-8 rounded-full'>
								<img src={currentUser?.profileImgUrl || "/public/avatar-placeholder.png"} />
							</div>
						</div>

						<div className='flex justify-between flex-1'>
							<div className='hidden md:block'>
								<p className='text-white font-bold text-sm w-20 truncate'>{currentUser?.fullName}</p>

								<p className='text-slate-500 text-sm'>@{currentUser?.username}</p>
							</div>

							<BiLogOut
								className='w-5 h-5 cursor-pointer'
								onClick={(e) => {
									e.preventDefault();
									logout();
								}}
							/>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};

export default Sidebar;
