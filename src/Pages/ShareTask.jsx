import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from '../Styles/OperationStyles/shareTask.module.css'
import toast from "react-hot-toast";
import baseURL from "../Utils/url";
import mainIcon from '../Images/mainIcon.png';

function ShareTask() {
	const { id } = useParams();
	const [task, setTask] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

	useEffect(() => {
		const fetchingTask = async () => {
			try {
				const res = await axios.get(`${baseURL}task/taskData/${id}`);
				setTask(res.data);
				setLoading(false);
			} catch (error) {
				setError(error);
				setLoading(false);
			}
		};

		fetchingTask();
		const handleResizing = () => {
			setIsMobileView(window.innerWidth < 768);
		};
		window.addEventListener("resize", handleResizing);
		return () => window.removeEventListener("resize", handleResizing);
	}, [id]);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	let priorityClass = "";
	switch (task.selectedpriority) {
		case "HIGH PRIORITY":
			priorityClass = styles.highPriority;
			break;
		case "MODERATE PRIORITY":
			priorityClass = styles.moderatePriority;
			break;
		case "LOW PRIORITY":
			priorityClass = styles.lowPriority;
			break;
		default:
			break;
	}

	const formateDate = (date) => {
		const options = { day: "2-digit", month: "short" };
		return new Intl.DateTimeFormat("en-GB", options).format(new Date(date));
	};

	const completedCount = task.checkedList.filter(
		(item) => item.completed
	).length;
	const totalCount = task.checkedList.length;

	return (
		<>
			<div>
				{task ? (
					<div
						className={
							isMobileView ? styles.shareTaskOnMobile : styles.shareTaskNormal
						}>
						<div className={styles.appName}>
							<img src={mainIcon} className={styles.icon} alt="" />
							Pro Manage
						</div>
						<div className={styles.shareDisplayTask}>
							<div className={styles.taskContent}>
								<div className={styles.priorityStyle}>
									<span
										className={`${styles.priority} ${priorityClass}`}></span>
									<div className={styles.priorityName}>
										{task.selectedpriority}
									</div>
								</div>

								<h1>{task.title}</h1>
								<h3>
									Checklist ({completedCount}/{totalCount}){" "}
								</h3>

								<div className={styles.checkedListConatiner}>
									<ul>
										{task.checkedList.map((item, index) => (
											<li key={index} className={styles.checkedListData}>
												<input
													type="checkbox"
													checked={item.completed}
													className={styles.checkBox}
													readOnly
												/>
												{item.text}
											</li>
										))}
									</ul>
								</div>
								<p className={styles.dueDate}>
									<strong>Due Date</strong>
									<button>{formateDate(task.duedate)} </button>
								</p>
							</div>
						</div>
					</div>
				) : (
					<div>
						<p>No task data available</p>
					</div>
				)}
			</div>
		</>
	);
}

export default ShareTask;
