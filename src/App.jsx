import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import SearchPage from "./pages/search/SearchPage";
import MessagePage from "./pages/message/MessagePage";
import BookmarkPage from "./pages/bookmark/BookmarkPage";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import LoadingSpinner from "./components/common/LoadingSpinner";

import { profileUser } from "./utils/api/usersApi";
import { logInSuccess } from "./redux/slice/userSlice";

function App() {
	const dispatch = useDispatch();

	const currentUser = useSelector((state) => state.user.currentUser);

	const getProfileUser = async () => {
		if (!currentUser?._id) return null;

		try {
			const res = await profileUser(currentUser.username);
			const data = res.data.user;

			if (res.status !== 200) {
				console.error(res);

				return
			}

			dispatch(logInSuccess(data))
		} catch (error) {
			console.error(res);
		}
	}
	const { isLoading } = useQuery({
		queryKey: ["authUser", currentUser?._id],
		queryFn: getProfileUser,
		enabled: !!currentUser?._id,
		retry: false,
	});

	if (isLoading) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}
	return (
		<div className='flex max-w-6xl mx-auto'>
			{currentUser && <Sidebar />}

			<Routes>
				<Route path='/' element={currentUser ? <HomePage /> : <Navigate to='/login' />} />

				<Route path='/login' element={!currentUser ? <LoginPage /> : <Navigate to='/' />} />

				<Route path='/register' element={!currentUser ? <RegisterPage /> : <Navigate to='/' />} />

				<Route path='/bookmarks' element={currentUser ? <BookmarkPage /> : <Navigate to='/login' />} />

				<Route path='/search' element={currentUser ? <SearchPage /> : <Navigate to='/login' />} />

				<Route path='/notifications' element={currentUser ? <NotificationPage /> : <Navigate to='/login' />} />

				<Route path='/messages' element={currentUser ? <MessagePage /> : <Navigate to='/login' />} />

				<Route path='/profile/:username' element={currentUser ? <ProfilePage /> : <Navigate to='/login' />} />
			</Routes>

			{currentUser && <RightPanel />}

			<Toaster />
		</div>
	);
}

export default App;