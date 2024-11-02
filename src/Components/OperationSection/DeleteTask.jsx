import React from "react";
import styles from "../../Styles/OperationStyles/deleteTask.module.css";
import axios from "axios";
import baseURL from "../../Utils/url";
import toast from "react-hot-toast";

function DeleteTask({ taskId, onDelete, onClose }) {
	const handleDeleteBtn = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				toast.error("Please login first");
				return;
			}

			const res = await axios.delete(`${baseURL}task/delete/${taskId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			console.log("Task ID to delete:", taskId);
			console.log("Delete response:", res.data);
			if (res.status === 200) {
				onDelete();
				onClose();
				toast.success("Task deleted successfully");
			} else {
				console.error("Unexpected response:", res);
				toast.error("Failed to delete task, Please try again");
			}
		} catch (error) {
			console.error("Error deleting task:", error.res ? error.res.data : error);
			toast.error("Failed to delete task, Please try again");
		}
	};

	return (
		<>
			<div>DeleteTask</div>
			<div className={styles.deleteTaskModalContainer}>
				<div className={styles.popupBox}>
					<div>Are you sure you want to Delete?</div>
					<button
						className={styles.deleteBtn}
						onClick={() => {
							handleDeleteBtn();
						}}>
						Yes, Delete
					</button>
					<br />
					<button className={styles.cancelBtn} onClick={onClose}>
						Cancel
					</button>
				</div>
			</div>
		</>
	);
}

export default DeleteTask;
