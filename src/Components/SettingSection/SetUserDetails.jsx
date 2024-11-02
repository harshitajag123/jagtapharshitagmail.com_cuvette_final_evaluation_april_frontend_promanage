// import React, { useEffect, useState } from "react";
// import styles from "../../Styles/DashboardStyles/setUserDetails.module.css";
// import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
// import { RiLockLine } from "react-icons/ri";
// import { MdOutlineEmail } from "react-icons/md";
// import { FaRegUser } from "react-icons/fa6";
// import axios from "axios";
// import { getUserData } from "../../Services/authService";
// import baseURL from "../../Utils/url";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// function SetUserDetails() {
// 	const [oldPassword, setOldPassword] = useState("");
// 	const [newPassword, setNewPassword] = useState("");
// 	const [user, setUser] = useState("");
// 	const [name, setName] = useState("");
// 	const [email, setEmail] = useState("");
// 	const [oldPassIcon, setOldPassIcon] = useState(false);
// 	const [newPassIcon, setNewPassIcon] = useState(false);
// 	const userId = localStorage.getItem("userId");
// 	const token = localStorage.getItem("token");
// 	const navigate = useNavigate();

// 	const toggleShowPass = () => {
// 		setOldPassIcon((prev) => {
// 			!prev;
// 		});
// 	};

// 	useEffect(() => {
// 		if (userId && token) {
// 			getUserData(userId, token)
// 				.then((data) => {
// 					setUser(data);
// 					setName(data.name);
// 					setEmail(data.email);
// 				})
// 				.catch((error) => console.log("Error Fetching user data:", error));
// 		}
// 	}, [userId, token]);

// 	//http://localhost:3000/api/
// 	const handleUpdate = async (e) => {
// 		e.preventDefault();
// 		try {
// 			const originalEmail = user.email;
// 			const res = await axios.patch(
// 				`${baseURL}auth/updateuserdata/${userId}`,
// 				{
// 					name,
// 					email,
// 					oldPassword,
// 					newPassword,
// 				},
// 				{
// 					headers: { Authorization: `Bearer ${token}` },
// 				}
// 			);

// 			// Clear local storage if email or password was updated
// 			if (originalEmail !== email || newPassword) {
// 				localStorage.removeItem("token");
// 				localStorage.removeItem("userId");
// 				navigate("/homepage"); // Redirect to homepage or login page
// 			}
// 			console.log(res);
// 			toast.success("Details updated successfully!");
// 		} catch (err) {
// 			console.error(err);
// 			toast.error("Error updating details!");
// 		}
// 	};

// 	if (!user) {
// 		return <div>Loading...</div>;
// 	}

// 	return (
// 		<>
// 			<div className={styles.heading}>Settings</div>
// 			<form onSubmit={handleUpdate} className={styles.formData}>
// 				<div className={styles.inputName}>
// 					<FaRegUser size={17} className={styles.icon} />
// 					<input
// 						value={name}
// 						onChange={(e) => setName(e.target.value)}
// 						type="text"
// 						placeholder="UserName"
// 						className={styles.inputField}
// 						name="name"
// 					/>
// 				</div>

// 				<div className={styles.inputEmail}>
// 					<MdOutlineEmail size={17} className={styles.icon} />
// 					<input
// 						value={email}
// 						onChange={(e) => setEmail(e.target.value)}
// 						type="email"
// 						name="email"
// 						placeholder="Email"
// 						className={styles.inputField}
// 					/>
// 				</div>

// 				<div className={styles.inputOldPass}>
// 					<div>
// 						<RiLockLine size={17} className={styles.icon} />
// 						<input
// 							value={oldPassword}
// 							onChange={(e) => setOldPassword(e.target.value)}
// 							type={oldPassIcon ? "text" : "password"}
// 							placeholder="Old Password"
// 							className={styles.inputField}
// 						/>
// 					</div>
// 					<button
// 						type="button"
// 						onClick={toggleShowPass}
// 						className={styles.eyeBtn}>
// 						{oldPassIcon ? (
// 							<IoEyeOffOutline className={styles.eyeIcon} />
// 						) : (
// 							<IoEyeOutline className={styles.eyeIcon} />
// 						)}
// 					</button>
// 				</div>

// 				<div className={styles.inputNewPass}>
// 					<div>
// 						<RiLockLine size={17} className={styles.icon} />
// 						<input
// 							value={newPassword}
// 							onChange={(e) => setNewPassword(e.target.value)}
// 							type={newPassIcon ? "text" : "password"}
// 							placeholder="New Password"
// 							className={styles.inputField}
// 						/>
// 					</div>
// 					<button
// 						type="button"
// 						onClick={toggleShowPass}
// 						className={styles.eyeBtn}>
// 						{newPassIcon ? (
// 							<IoEyeOffOutline className={styles.eyeIcon} />
// 						) : (
// 							<IoEyeOutline className={styles.eyeIcon} />
// 						)}
// 					</button>
// 				</div>

// 				<button type="submit" className={styles.updateBtn}>
// 					Update
// 				</button>
// 			</form>
// 		</>
// 	);
// }

// export default SetUserDetails;

import React, { useEffect, useState } from "react";
import styles from "../../Styles/DashboardStyles/setUserDetails.module.css";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { RiLockLine } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { TiUserOutline } from "react-icons/ti";
import { FaRegUser } from "react-icons/fa6";
import axios from "axios";
import { getUserData } from "../../Services/authService";
import baseURL from "../../Utils/url";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function SetUserDetails() {
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [user, setUser] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [oldPassIcon, setOldPassIcon] = useState(false);
	const [newPassIcon, setNewPassIcon] = useState(false);
	const userId = localStorage.getItem("userId");
	const token = localStorage.getItem("token");
	const navigate = useNavigate();

	// Toggle the password visibility
	const toggleShowPass = (type) => {
		if (type === "old") {
			setOldPassIcon((prev) => !prev);
		} else if (type === "new") {
			setNewPassIcon((prev) => !prev);
		}
	};

	useEffect(() => {
		if (userId && token) {
			getUserData(userId, token)
				.then((data) => {
					setUser(data);
					setName(data.name);
					setEmail(data.email);
				})
				.catch((error) => console.log("Error Fetching user data:", error));
		}
	}, [userId, token]);

	const handleUpdate = async (e) => {
		e.preventDefault();
		try {
			const originalEmail = user.email;
			const res = await axios.patch(
				`${baseURL}auth/updateuserdata/${userId}`,
				{
					name,
					email,
					oldPassword,
					newPassword,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			// Clear local storage if email or password was updated
			if (originalEmail !== email || newPassword) {
				localStorage.removeItem("token");
				localStorage.removeItem("userId");
				navigate("/homepage"); // Redirect to homepage or login page
			}
			console.log(res);
			toast.success("Details updated successfully!");
		} catch (err) {
			console.error(err);
			toast.error(
				"Error updating details! All fields are required, or Check Details and Try Again!"
			);
		}
	};

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<div className={styles.heading}>Settings</div>
			<form onSubmit={handleUpdate} className={styles.formData}>
				<div className={styles.inputName}>
					<TiUserOutline size={27} className={styles.icon} />
					<input
						value={name}
						onChange={(e) => setName(e.target.value)}
						type="text"
						placeholder="UserName"
						className={styles.inputField}
						name="name"
					/>
				</div>

				<div className={styles.inputEmail}>
					<MdOutlineEmail size={17} className={styles.icon} />
					<input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						type="email"
						name="email"
						placeholder="Email"
						className={styles.inputField}
					/>
				</div>

				<div className={styles.inputOldPass}>
					<div>
						<CiLock size={27} className={styles.icon} />
						<input
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
							type={oldPassIcon ? "text" : "password"}
							placeholder="Old Password"
							className={styles.inputField}
						/>
					</div>
					<button
						type="button"
						onClick={() => toggleShowPass("old")}
						className={styles.eyeBtn}>
						{oldPassIcon ? (
							<IoEyeOffOutline size={17} className={styles.eyeIcon} />
						) : (
							<IoEyeOutline size={17} className={styles.eyeIcon} />
						)}
					</button>
				</div>

				<div className={styles.inputNewPass}>
					<div>
						<CiLock size={27} className={styles.icon} />
						<input
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							type={newPassIcon ? "text" : "password"}
							placeholder="New Password"
							className={styles.inputField}
						/>
					</div>
					<button
						type="button"
						onClick={() => toggleShowPass("new")}
						className={styles.eyeBtn}>
						{newPassIcon ? (
							<IoEyeOffOutline className={styles.eyeIcon} />
						) : (
							<IoEyeOutline className={styles.eyeIcon} />
						)}
					</button>
				</div>

				<button type="submit" className={styles.updateBtn}>
					Update
				</button>
			</form>
		</>
	);
}

export default SetUserDetails;
