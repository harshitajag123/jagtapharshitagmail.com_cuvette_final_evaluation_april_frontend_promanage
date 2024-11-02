import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Register from "./Register";
import { loginUser } from "../../Services/authService";
import styles from "../../Styles/AuthStyles/login.module.css";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { RiLockLine } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import toast from "react-hot-toast";

function Login() {
	const [data, setData] = useState({ email: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const [errors, setErrors] = useState({ email: "", password: "" });

	const navigate = useNavigate();

	// handle eye icon click to toggle password visibility
	const handleEyeClick = () => {
		setShowPassword((prev) => !prev);
	};

	// handle change in input fields
	const handleChange = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
		setErrors({ ...errors, [e.target.name]: "" });
	};

	// validate email and password
	const validateDetails = () => {
		let isValid = true;
		let newErrors = { email: "", password: "" };

		if (!data.email) {
			newErrors.email = "Email is required";
			isValid = false;
		}

		if (!data.password) {
			newErrors.password = "Password is required";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	// handle login submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateDetails()) {
			toast.error("Please fill all the required fields.");
			return; // Stop submission if validation fails
		}

		try {
			const res = await loginUser(data);
			if (res.status === "error") {
				if (res.code == 401) {
					// Assuming you get a 401 error code for unauthorized users
					toast.error("Unauthorized! Please register first.");
				} else {
					toast.error(res.message || "An error occurred, please try again");
				}
			} else if (res.status === "success") {
				localStorage.setItem("token", res.token);
				localStorage.setItem("userId", res.userId);
				localStorage.setItem("userEmail", res.email);
				toast.success("Login Successfully!");
				navigate("/taskpage");
			}
		} catch (err) {
			console.error("Login error: ", err);
			toast.error("Login Failed, please try again");
		}
	};

	return (
		<>
			{showRegister ? (
				<Register setShowRegister={setShowRegister} />
			) : (
				<div className={styles.loginPg}>
					<div className={styles.heading}>Login</div>
					<form onSubmit={handleSubmit} className={styles.formData}>
						<div className={styles.inputfield}>
							{/* Email Field */}
							<div className={styles.inputEmail}>
								<MdOutlineEmail size={27} className={styles.icon} />
								<input
									type="email"
									className={styles.emailField}
									placeholder="Email"
									name="email"
									value={data.email}
									onChange={handleChange}
								/>
							</div>
							{errors.email && (
								<div className={styles.errMsg}>{errors.email}</div>
							)}

							{/* Password Field */}
							<div className={styles.inputPassword}>
								<RiLockLine size={27} className={styles.icon} />
								<div className={styles.inputdiv}>
									<input
										type={showPassword ? "text" : "password"}
										className={styles.passwordField}
										placeholder="Password"
										name="password"
										value={data.password}
										onChange={handleChange}
									/>
								</div>
								<div onClick={handleEyeClick} className={styles.eyeIcon}>
									{showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
								</div>
							</div>
							{errors.password && (
								<div className={styles.errMsg}>{errors.password}</div>
							)}

							{/* Submit Button */}
							<button type="submit" className={styles.authBtn}>
								Log in
							</button>
						</div>
					</form>

					{/* Register Link */}
					<div>
						<div className={styles.para}>Have no account yet?</div>
						<button
							className={styles.registerBtn}
							onClick={() => setShowRegister(true)}>
							Register
						</button>
					</div>
				</div>
			)}
		</>
	);
}

export default Login;
