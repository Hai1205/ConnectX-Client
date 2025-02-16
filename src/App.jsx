import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { profileUser } from "./utils/api/usersApi";
import { useDispatch, useSelector } from "react-redux";
import { logInSuccess } from "./redux/slice/userSlice";

function App() {
	const currentUser = useSelector((state) => state.user.currentUser);
	const dispatch = useDispatch();

	const getProfileUser = async () => {
		if (!currentUser?._id) return null;

		try {
			const res = await profileUser(currentUser.username);
			const data = res.data.user;

			if (res.status !== 200) {
				console.error(res);
			}

			dispatch(logInSuccess(data));
			return data;
		} catch (error) {
			console.error(res);
		}
	}
	const { data: authUser, isLoading } = useQuery({
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

				<Route path='/notifications' element={currentUser ? <NotificationPage /> : <Navigate to='/login' />} />

				<Route path='/profile/:username' element={currentUser ? <ProfilePage /> : <Navigate to='/login' />} />
			</Routes>

			{currentUser && <RightPanel />}

			<Toaster />
		</div>
	);
}

export default App;