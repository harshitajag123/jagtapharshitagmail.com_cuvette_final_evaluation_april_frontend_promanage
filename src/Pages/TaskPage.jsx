import React, { useState } from "react";
import styles from "../Styles/PageStyles/taskPage.module.css";
import Board from "../Components/BoardSection/Board";
import Analytics from "../Components/AnalyticsSection/Analytics";
import SetUserDetails from "../Components/SettingSection/SetUserDetails";
import Logout from "../Components/AuthSection/Logout";
import analytics from "../Images/analytics.png";
import board from "../Images/board.png";
import settings from "../Images/settings.png";
import mainIcon from "../Images/mainIcon.png";
import logout from "../Images/logout.png";

function TaskPage() {
	const [showLogout, setShowLogout] = useState(false);
	const [selectedComp, setSelectedComp] = useState("Board");

	const renderComp = () => {
		switch (selectedComp) {
			case "Board":
				return <Board />;
			case "Analytics":
				return <Analytics />;
			case "Settings":
				return <SetUserDetails />;
			default:
				return <Board />;
		}
	};

	return (
		<>
			<div className={styles.mainPg}>
				<div className={styles.navBar}>
					<div className={styles.listPart}>
						<li className={styles.heading}>
							<img src={mainIcon} className={styles.icon} />
							Pro Manage
						</li>
						<ul>
							<li
								className={`${styles.list} ${
									selectedComp === "Board" ? styles.selected : ""
								}`}
								onClick={() => setSelectedComp("Board")}>
								<img src={board} className={styles.icon} />
								Board
							</li>

							<li
								className={`${styles.list} ${
									selectedComp === "Analytics" ? styles.selected : ""
								}`}
								onClick={() => setSelectedComp("Analytics")}>
								<img src={analytics} className={styles.icon} />
								Analytics
							</li>

							<li
								className={`${styles.list} ${
									selectedComp === "Setting" ? styles.selected : ""
								}`}
								onClick={() => setSelectedComp("Settings")}>
								<img src={settings} className={styles.icon} />
								Settings
							</li>
						</ul>
					</div>
					<div className={styles.logoutDiv}>
						<button
							className={styles.logoutBtn}
							onClick={() => setShowLogout(true)}>
							<img src={logout} className={styles.logIcon} />
							Logout
						</button>
					</div>
				</div>
				<div className={styles.taskPlace}>{renderComp()}</div>

				{showLogout && <Logout onClose={() => setShowLogout(false)} />}
			</div>
		</>
	);
}

export default TaskPage;
