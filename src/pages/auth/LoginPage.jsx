import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../../utils/api/authApi";
import { useDispatch } from "react-redux";
import { logInSuccess } from "../../redux/slice/userSlice";
import toast from "react-hot-toast";

const LoginPage = () => {
	const dispatch = useDispatch();

	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const login = async (formData) => {
		try {
			const res = await loginUser(formData);
			const data = await res.data.user;

			if (res.status !== 200) {
				console.error(res);
				toast.error(res.message);

				return null;
			}

			return data;
		} catch (error) {
			console.error(error);
			toast.error(error.message)
		}
	}
	const {
		mutate: loginMutation,
		data,
		isPending,
	} = useMutation({
		mutationFn: login,
		onSuccess: (data) => {
			if (data) {
				setFormData({
					username: "",
					password: "",
				});

				dispatch(logInSuccess(data));
			}
		},
	});
	const handleSubmit = (e) => {
		e.preventDefault();

		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>

			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />

					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />

						<input
							type='text'
							className='grow'
							placeholder='username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />

						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>

					<button className='btn rounded-full btn-primary text-white'>
						{isPending ? "Loading..." : "Login"}
					</button>
				</form>

				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>

					<Link to='/register'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Register</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
