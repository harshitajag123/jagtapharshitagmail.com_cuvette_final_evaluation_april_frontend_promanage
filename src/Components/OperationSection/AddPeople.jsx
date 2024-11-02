import React, { useState } from "react";
import baseURL from "../../Utils/url";
import axios from "axios";
import styles from "../../Styles/OperationStyles/addPeople.module.css";
import toast from "react-hot-toast";

function AddPeople({ onCancel }) {
	const [emails, setEmails] = useState([""]);
	const [error, setErrors] = useState("");
	const [successMsg, setSuccessMsg] = useState("");
	const [addEmails, setAddEmails] = useState([]);

	const handleInChange = (index, e) => {
		const newEmails = [...emails];
		newEmails[index] = e.target.value;
		setEmails(newEmails);
	};

	const handleSubmitBtn = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				toast.error("Please login first");
				return;
			}
			const res = await axios.patch(
				`${baseURL}auth/addpeople`,
				{ emails },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			if (res.status === 200) {
				setSuccessMsg("People added successfully");
				setAddEmails([""]);
				setAddEmails(emails);
			} else {
				setErrors("Failed to add people");
			}
		} catch (error) {
			setErrors(
				`Failed to add emails : ${
					error.res ? error.res.data.message : error.message
				}`
			);
		}
	};
	return (
		<>
			<div>Add people</div>
			<div className={styles.AddPeopleModalContainer}>
				<div className={styles.popupModal}>
					{successMsg ? (
						<>
							<div className={styles.successMsgPop}>
								<h2>
									{addEmails.map((email, index) => (
										<div key={index} className={styles.successEmail}>
											{email} added to board
										</div>
									))}
								</h2>
								<button className={styles.okBtn} onClick={onCancel}>
									Okay, got it!
								</button>
							</div>
						</>
					) : (
						<>
							<div>
								<h2>Add People to Board</h2>
								<form onSubmit={handleSubmitBtn}>
									{emails.map((email, index) => (
										<input
											key={index}
											type="email"
											value={email}
											onChange={(e) => handleInChange(index, e)}
											placeholder="Enter Email"
											required
										/>
									))}
									<div>
										<button className={styles.cancelBtn} onClick={onCancel}>
											Cancel
										</button>
										<button className={styles.addEmailBtn} type="submit">
											Add Email
										</button>
									</div>
								</form>
							</div>
						</>
					)}
					{error && <p className={styles.errMsg}>{error}</p>}
				</div>
			</div>
		</>
	);
}

export default AddPeople;
