import axios from "axios";
import baseURL from "../Utils/url";
import toast from "react-hot-toast";

//http://localhost:3000/api/
const getTasks = async (selectedOption, setTasks, setError) => {
	try {
		const token = localStorage.getItem("token");
		const userEmail = localStorage.getItem("userEmail");

		//check whether token and userEmail is present or not and display respective error message
		if (!token) {
			toast.error("Please login first");
			return;
		}
		const userId = localStorage.getItem("userId");
		if (!userId) {
			toast.error("Please register first");
			return;
		}
		if (!userEmail) {
			console.warn("userEmail is not found");
		}

		const res = await axios.get(`${baseURL}task/getUser/${userId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				email: userEmail,
			},
			params: {
				filter: selectedOption,
			},
		});

		if (res.status === 200) {
			const userTasks = res.data;
			const taskByStatus = {
				backlog: userTasks.filter((task) => task.status === "backlog"),
				inProgress: userTasks.filter((task) => task.status === "inProgress"),
				done: userTasks.filter((task) => task.status === "done"),
			};
			setTasks(taskByStatus);
			setError("");

			if (userTasks.length === 0) {
				// toast.error("No tasks found");
			 console.log ("No tasks found");
			}
		} else {
			console.error("Error fetching tasks", res);
			toast.error("Error fetching tasks. Please try again later");
		}
	} catch (error) {
		console.error("Error fetching tasks:", error.res ? error.res.data : error);
		setError(
			error.res
				? error.res.data.message
				: "Failed to fetch tasks. Please try again."
		);
	}
};



// const getTasks = async (selectedOption, setTasks, setError) => {
// 	try {
// 		const token = localStorage.getItem("token");
// 		const userEmail = localStorage.getItem("userEmail");

// 		// Check whether token and userEmail are present and display respective error messages
// 		if (!token) {
// 			toast.error("Please login first");
// 			return;
// 		}
// 		const userId = localStorage.getItem("userId");
// 		if (!userId) {
// 			toast.error("Please register first");
// 			return;
// 		}
// 		if (!userEmail) {
// 			console.warn("userEmail is not found");
// 		}

// 		// API request
// 		const res = await axios.get(`${baseURL}task/getUser/${userId}`, {
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 				email: userEmail,
// 			},
// 			params: {
// 				filter: selectedOption,
// 			},
// 		});

// 		// Check if the response is successful
// 		if (res.status === 200) {
// 			const userTasks = res.data;

// 			// Check if userTasks is defined and an array
// 			if (!userTasks || !Array.isArray(userTasks)) {
// 				console.error("Expected an array of tasks but received:", userTasks);
// 				toast.error("Unexpected response format. Please try again later.");
// 				setError("Unexpected response format");
// 				return;
// 			}

// 			// Organize tasks by status
// 			const taskByStatus = {
// 				backlog: userTasks.filter((task) => task.status === "backlog"),
// 				inProgress: userTasks.filter((task) => task.status === "inProgress"),
// 				done: userTasks.filter((task) => task.status === "done"),
// 			};
// 			setTasks(taskByStatus);
// 			setError("");

// 			if (userTasks.length === 0) {
// 				toast.error("No tasks found");
// 			}
// 		} else {
// 			console.error("Error fetching tasks", res);
// 			toast.error("Error fetching tasks. Please try again later");
// 		}
// 	} catch (error) {
// 		console.error(
// 			"Error fetching tasks:",
// 			error.response ? error.response.data : error
// 		);
// 		setError(
// 			error.response
// 				? error.response.data.message
// 				: "Failed to fetch tasks. Please try again."
// 		);
// 	}
// };

export { getTasks };


// export { getTasks };
