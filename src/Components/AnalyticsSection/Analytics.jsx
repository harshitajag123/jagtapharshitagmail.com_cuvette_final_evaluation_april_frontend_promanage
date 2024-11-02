import React, { useEffect, useState } from "react";
import baseURL from "../../Utils/url";
import styles from "../../Styles/DashboardStyles/analytics.module.css";
import axios from "axios";
import toast from "react-hot-toast";

function Analytics() {
	const [analytics, setAnalytics] = useState({
		backlog: 0,
		todo: 0,
		inProgress: 0,
		done: 0,
		lowPriority: 0,
		moderatePriority: 0,
		highPriority: 0,
		dueDateTasks: 0,
	});

	useEffect(() => {
		const fetchingAnalytics = async () => {
			try {
				const token = localStorage.getItem("token");
				const userId = localStorage.getItem("userId");
				const userEmail = localStorage.getItem("userEmail");

				if (!token) {
					toast.error("Please login first");
					return;
				}

				if (!userId) {
					toast.error("Please login first");
					return;
				}

				if (!userEmail) {
					toast.error("Please login first");
					return;
				}

				const res = await axios.get(`${baseURL}task/analytics/${userId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
						email: userEmail,
					},
				});

				if (res.status === 200) {
					setAnalytics(res.data);
				} else {
					console.error("Error fetching analytics:", res);
					toast.error("Error fetching analytics. Please try again.");
				}
			} catch (error) {
				console.error(
					"Error fetching analytics:",
					error.res ? error.res.data : error
				);
				toast.error("Error fetching analytics. Please try again.");
			}
		};
		fetchingAnalytics();
	}, []);

	return (
		<>
			<div className={styles.analyticsContainer}>
				<div className={styles.headingPart}>Analytics</div>
				<div className={styles.analyticsPart}>
					<div className={styles.analyticsCard}>
						<ul className={styles.analyticsList}>
							<li className={styles.analyticsListItem}>
								<span>Backlog Tasks</span>
								<span>{analytics.backlog} </span>
							</li>
							<li className={styles.analyticsListItem}>
								<span>To-do Tasks</span>
								<span>{analytics.todo} </span>
							</li>
							<li className={styles.analyticsListItem}>
								<span>In-Progress Tasks</span>
								<span>{analytics.inProgress} </span>
							</li>
							<li className={styles.analyticsListItem}>
								<span>Completed Tasks</span>
								<span>{analytics.done} </span>
							</li>
						</ul>
					</div>

					{/* priority  analytics lists  */}

					<div className={styles.analyticsCard}>
						<ul className={styles.analyticsList}>
							<li className={styles.analyticsListItem}>
								<p> Low Priority</p>
								<p>{analytics.lowPriority} </p>
							</li>
							<li className={styles.analyticsListItem}>
								<p> Moderate Priority</p>
								<p>{analytics.moderatePriority} </p>
							</li>
							<li className={styles.analyticsListItem}>
								<p> High Priority</p>
								<p>{analytics.highPriority} </p>
							</li>
							<li className={styles.analyticsListItem}>
								<p> Due Date Tasks</p>
								<p>{analytics.dueDateTasks} </p>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}

export default Analytics;
