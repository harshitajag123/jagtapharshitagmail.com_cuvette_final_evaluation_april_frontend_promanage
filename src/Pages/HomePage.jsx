import React, { useState } from "react";
import styles from "../Styles/PageStyles/homePage.module.css";
import authImg from "../Images/authImg.png";
import Login from "../Components/AuthSection/Login";
function HomePage() {
	const [showLogin, setShowLogin] = useState(true);

	return (
		<>
			
			<div className={styles.mainpage}>
				<div className={styles.image}>
          <div className={styles.circle}></div>
					<img src={authImg} alt="Image" />
					<div>
						<h1 className={styles.heading}>Welcome aboard my friend</h1>
						<p className={styles.subHeading}>
							just a couple of clicks and we start
						</p>
					</div>
				</div>
				<div className={styles.login}>
					<Login />
				</div>
			</div>
		</>
	);
}

export default HomePage;
