// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import { RegisterUser } from "../../Services/authService";
// import styles from "../../Styles/AuthStyles/register.module.css";
// import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
// import { RiLockLine } from "react-icons/ri";
// import { MdOutlineEmail } from "react-icons/md";
// import { FaRegUser } from "react-icons/fa6";

// function Register({ setShowRegister }) {
// 	const [data, setData] = useState({
// 		name: "",
// 		email: "",
// 		password: "",
// 		confirmPass: "",
// 	});
// 	const [passMatchError, setPassMatchError] = useState(false);
// 	const [errors, setErrors] = useState({
// 		name: "",
// 		email: "",
// 		password: "",
// 		confirmPass: "",
// 	});
// 	const [showPassword, setShowPassword] = useState(false);
// 	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

// 	// Move these functions outside of the `register` function
// 	const togglePassword = () => {
// 		setShowPassword((prev) => !prev);
// 	};

// 	const toggleConfirmPassword = () => {
// 		setShowConfirmPassword((prev) => !prev);
// 	};

// 	const handleChange = (e) => {
// 		const { name, value } = e.target;
// 		setData({ ...data, [name]: value });
// 		setErrors({ ...errors, [name]: "" });
// 	};

// 	const validate = () => {
// 		let isValid = true;
// 		let newErrors = { name: "", email: "", password: "", confirmPass: "" };
// 		if (!data.name) {
// 			newErrors.name = "Name is required";
// 			isValid = false;
// 		}
// 		if (!data.email) {
// 			newErrors.email = "Email is required";
// 			isValid = false;
// 		}
// 		if (!data.password) {
// 			newErrors.password = "Password is required";
// 			isValid = false;
// 		}
// 		if (!data.confirmPass) {
// 			newErrors.confirmPass = "Confirm Password is required";
// 			isValid = false;
// 		}
// 		setErrors(newErrors);
// 		return isValid;
// 	};

// 	const register = async (e) => {
// 		e.preventDefault();
// 		if (!validate()) {
// 			return;
// 		}

// 		if (data.password !== data.confirmPass) {
// 			setPassMatchError(true);
// 			return;
// 		} else {
// 			setPassMatchError(false);
// 		}

// 		try {
// 			const response = await RegisterUser(data);
// 			if (response.status === "error") {
// 				toast.error("Registration Failed!");
// 			} else if (response.status === "success") {
// 				toast.success("Registration Successful!");
// 				setShowRegister(false); // Correctly setting state here
// 			}
// 		} catch (err) {
// 			console.error("Registration error : ", err);
// 			toast.error("Registration failed");
// 		}

// 		setData({ name: "", email: "", password: "", confirmPass: "" });
// 	};

// 	return (
// 		<>
// 			<div>Register</div>
// 			<div className={styles.mainPg}>
// 				<p className={styles.heading}>Register</p>
// 				<form onSubmit={register} className={styles.formData}>
// 					<div>
// 						<div className={styles.inputName}>
// 							<FaRegUser size={27} className={styles.icon} />
// 							<input
// 								type="text"
// 								className={styles.inputField}
// 								name="name"
// 								placeholder="Name"
// 								value={data.name}
// 								onChange={handleChange}
// 							/>
// 						</div>
// 						{errors.name && <p className={styles.errMsg}>{errors.name}</p>}
// 					</div>

// 					<div>
// 						<div className={styles.inputEmail}>
// 							<MdOutlineEmail size={27} className={styles.icon} />
// 							<input
// 								type="email"
// 								className={styles.inputField}
// 								name="email"
// 								placeholder="Email"
// 								value={data.email}
// 								onChange={handleChange}
// 							/>
// 						</div>
// 						{errors.email && <p className={styles.errMsg}>{errors.email}</p>}
// 					</div>

// 					<div>
// 						<div className={styles.inputPassword}>
// 							<div>
// 								<RiLockLine size={27} className={styles.icon} />
// 								<input
// 									type={showPassword ? "text" : "password"}
// 									className={styles.inputField}
// 									name="password" // Corrected the name attribute
// 									placeholder="Password"
// 									value={data.password}
// 									onChange={handleChange}
// 								/>
// 							</div>

// 							<div>
// 								<button
// 									type="button"
// 									onClick={togglePassword}
// 									className={styles.eyeBtn}>
// 									{showPassword ? (
// 										<IoEyeOffOutline className={styles.eyeIcon} />
// 									) : (
// 										<IoEyeOutline className={styles.eyeIcon} />
// 									)}
// 								</button>
// 							</div>
// 						</div>
// 						{errors.password && (
// 							<p className={styles.errMsg}>{errors.password}</p>
// 						)}
// 					</div>

// 					<div>
// 						<div className={styles.inputConfirmPassword}>
// 							<div>
// 								<RiLockLine size={27} className={styles.icon} />
// 								<input
// 									type={showConfirmPassword ? "text" : "password"}
// 									className={styles.inputField}
// 									name="confirmPass" // Corrected the name attribute
// 									placeholder=" Confirm Password"
// 									value={data.confirmPass}
// 									onChange={handleChange}
// 								/>
// 							</div>

// 							<div>
// 								<button
// 									type="button"
// 									onClick={toggleConfirmPassword}
// 									className={styles.eyeBtn}>
// 									{showConfirmPassword ? (
// 										<IoEyeOffOutline className={styles.eyeIcon} />
// 									) : (
// 										<IoEyeOutline className={styles.eyeIcon} />
// 									)}
// 								</button>
// 							</div>
// 						</div>
// 						{errors.confirmPass && (
// 							<p className={styles.errMsg}>{errors.confirmPass}</p>
// 						)}
// 						{passMatchError && (
// 							<p style={{ color: "red" }}>Passwords do not match</p>
// 						)}
// 					</div>
// 					<button type="submit" className={styles.registerBtn}>
// 						Register
// 					</button>
// 				</form>
// 				<p className={styles.para}>Have an account?</p>
// 				<button
// 					className={styles.loginbtn}
// 					onClick={() => setShowRegister(false)}>
// 					Log in
// 				</button>
// 			</div>
// 		</>
// 	);
// }

// export default Register;

import React, { useState } from "react";
import toast from "react-hot-toast";
import { RegisterUser } from "../../Services/authService";
import styles from "../../Styles/AuthStyles/register.module.css";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { RiLockLine } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";

function Register({ setShowRegister }) {
	const [data, setData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPass: "",
	});
	const [passMatchError, setPassMatchError] = useState(false);
	const [errors, setErrors] = useState({
		name: "",
		email: "",
		password: "",
		confirmPass: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const togglePassword = () => {
		setShowPassword((prev) => !prev);
	};

	const toggleConfirmPassword = () => {
		setShowConfirmPassword((prev) => !prev);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setData({ ...data, [name]: value });
		setErrors({ ...errors, [name]: "" });
	};

	const validate = () => {
		let isValid = true;
		let newErrors = { name: "", email: "", password: "", confirmPass: "" };
		if (!data.name) {
			newErrors.name = "Name is required";
			isValid = false;
		}
		if (!data.email) {
			newErrors.email = "Email is required";
			isValid = false;
		}
		if (!data.password) {
			newErrors.password = "Password is required";
			isValid = false;
		}
		if (!data.confirmPass) {
			newErrors.confirmPass = "Confirm Password is required";
			isValid = false;
		}
		setErrors(newErrors);
		return isValid;
	};

	const register = async (e) => {
		e.preventDefault();
		if (!validate()) {
			toast.error("Please fill all the required fields.");
			return;
		}

		const isValidUsername = (name) => /^[a-zA-Z0-9]+$/.test(name);
		if (!isValidUsername(data.name)) {
			toast.error("Username can only contain letters and numbers.");
			return;
		}

		if (data.password !== data.confirmPass) {
			setPassMatchError(true);
			toast.error("Passwords do not match.");
			return;
		} else {
			setPassMatchError(false);
		}

		try {
			const response = await RegisterUser(data);
			if (response.status === "error") {
				// Check for specific 'User already exists' message
				if (response.message === "User already exists.") {
					toast.error("User already registered. Please log in instead.");
				} else {
					toast.error("Registration Failed!");
				}
			} else if (response.status === "success") {
				setShowRegister(false);
				toast.success("Registration Successful!"); // Show toast on registration success
			}
		} catch (err) {
			console.error("Registration error: ", err);
			toast.error("Registration failed. Please try again.");
		}

		setData({ name: "", email: "", password: "", confirmPass: "" });
	};

	return (
		<>
			<div className={styles.mainPg}>
				<p className={styles.heading}>Register</p>
				<form onSubmit={register} className={styles.formData}>
					<div>
						<div className={styles.inputName}>
							<FaRegUser size={27} className={styles.icon} />
							<input
								type="text"
								className={styles.inputField}
								name="name"
								placeholder="Name"
								value={data.name}
								onChange={handleChange}
							/>
						</div>
						{errors.name && <p className={styles.errMsg}>{errors.name}</p>}
					</div>

					<div>
						<div className={styles.inputEmail}>
							<MdOutlineEmail size={27} className={styles.icon} />
							<input
								type="email"
								className={styles.inputField}
								name="email"
								placeholder="Email"
								value={data.email}
								onChange={handleChange}
							/>
						</div>
						{errors.email && <p className={styles.errMsg}>{errors.email}</p>}
					</div>

					<div>
						<div className={styles.inputPassword}>
							<div>
								<RiLockLine size={27} className={styles.icon} />
								<input
									type={showPassword ? "text" : "password"}
									className={styles.inputField}
									name="password"
									placeholder="Password"
									value={data.password}
									onChange={handleChange}
								/>
							</div>

							<div>
								<button
									type="button"
									onClick={togglePassword}
									className={styles.eyeBtn}>
									{showPassword ? (
										<IoEyeOffOutline className={styles.eyeIcon} size={17} />
									) : (
										<IoEyeOutline className={styles.eyeIcon} size={17} />
									)}
								</button>
							</div>
						</div>
						{errors.password && (
							<p className={styles.errMsg}>{errors.password}</p>
						)}
					</div>

					<div>
						<div className={styles.inputConfirmPassword}>
							<div>
								<RiLockLine size={27} className={styles.icon} />
								<input
									type={showConfirmPassword ? "text" : "password"}
									className={styles.inputField}
									name="confirmPass"
									placeholder=" Confirm Password"
									value={data.confirmPass}
									onChange={handleChange}
								/>
							</div>

							<div>
								<button
									type="button"
									onClick={toggleConfirmPassword}
									className={styles.eyeBtn}>
									{showConfirmPassword ? (
										<IoEyeOffOutline className={styles.eyeIcon} size={17} />
									) : (
										<IoEyeOutline className={styles.eyeIcon} size={17} />
									)}
								</button>
							</div>
						</div>
						{errors.confirmPass && (
							<p className={styles.errMsg}>{errors.confirmPass}</p>
						)}
						{passMatchError && (
							<p style={{ color: "red" }}>Passwords do not match</p>
						)}
					</div>
					<button type="submit" className={styles.registerBtn}>
						Register
					</button>
				</form>
				<p className={styles.para}>Have an account?</p>
				<button
					className={styles.loginbtn}
					onClick={() => setShowRegister(false)}>
					Log in
				</button>
			</div>
		</>
	);
}

export default Register;
