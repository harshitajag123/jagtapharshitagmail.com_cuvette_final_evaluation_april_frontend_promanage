import React from "react";
import toast from "react-hot-toast";
import styles from "../../Styles/AuthStyles/logout.module.css";
import { useNavigate } from "react-router-dom";
function Logout({ onClose }) {

	const navigate = useNavigate();
	const logout = () => {
    toast.success("Logout Successfully!")

		localStorage.clear();
		navigate("/homepage");
	};

	return (
		<>
			<div className={styles.main}>
				<div className={styles.popup}>
					<p>Are you sure you want to Logout?</p>
					<button onClick={logout} className={styles.logBtn}>
						Yes, Logout
					</button>{" "}
					<br />
					<button onClick={onClose} className={styles.closeBtn}>
						Cancel
					</button>
				</div>
			</div>
		</>
	);
}

export default Logout;
