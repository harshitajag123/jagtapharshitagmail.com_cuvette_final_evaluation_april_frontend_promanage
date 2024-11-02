// //duplicate copy original code is above
import React, { useEffect, useState } from "react";
import styles from "../../Styles/DashboardStyles/board.module.css";
import axios from "axios";
import { getTasks } from "../../Services/taskService";
import baseURL from "../../Utils/url";
import collaspse from "../../Images/collapse.png";
import { FaPlus } from "react-icons/fa";
import { PiDotsThreeOutlineBold } from "react-icons/pi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { GoPeople } from "react-icons/go";
import AddPeople from "../OperationSection/AddPeople";
import DeleteTask from "../OperationSection/DeleteTask";
import EditTask from "../OperationSection/EditTask";
import AddTask from "../OperationSection/AddTask";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Board() {
	const navigate = useNavigate();
	const [selectedOption, setSelectedOption] = useState("thisweek");
	const [isAddPeople, setIsAddPeople] = useState(false);
	const [isAddTask, setIsAddTask] = useState(false);
	const [currDate, setCurrDate] = useState("");
	const [tasks, setTasks] = useState({
		backlog: [],
		todo: [],
		inProgress: [],
		done: [],
	});

	const [error, setError] = useState("");
	const [publicLink, setPublicLink] = useState("");
	const [linkcopied, setlinkcopied] = useState(false);
	const [taskToEdit, setTaskToEdit] = useState(null);
	const [taskToDelete, setTaskToDelete] = useState(null);
	const [isDeleteTask, setIsDeleteTask] = useState(false);
	const [menuVisible, setMenuVisible] = useState({});
	const [userName, setUserName] = useState("");
	const [checklistVisible, setChecklistVisible] = useState({});
	const [navigateToPublic, setNavigateToPublic] = useState(false);
	const [isEditTask, setIsEditTask] = useState(false);
	const [loading, setLoading] = useState(true); // Track loading state

	useEffect(() => {
		if (navigateToPublic && publicLink) {
			navigate(publicLink);
			setNavigateToPublic(false);
		}
	}, [navigateToPublic, publicLink, navigate]);

	useEffect(() => {
		//to fetch user data
		const getUserData = async () => {
			try {
				const token = localStorage.getItem("token");
				const userId = localStorage.getItem("userId");
				if (!token) {
					toast.error("Please login first");
					return;
				}

				const res = await axios.get(`${baseURL}auth/userdata/${userId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (res.status === 200) {
					setUserName(res.data.name);
				} else {
					console.error("Error fetching user data:", res);
				}
			} catch (error) {
				console.error(
					"Error fetching user data:",
					error.re ? error.re.data : error
				);
			}
		};
		getUserData();
	}, []);

	const fetchTask = async () => {
		try {
			const token = localStorage.getItem("token");
			const userId = localStorage.getItem("userId");
			if (!token) {
				toast.error("Please login first");
				return;
			}

			const response = await axios.get(`${baseURL}task/getUser/${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			//console.log("Fetched tasks:", response.data);

			//const userTasks = response.data || [];
			if (response.status === 200) {
				const userTasks = response.data || [];

				const newTasks = {
					backlog: userTasks.filter((task) => task.status === "backlog"),
					todo: userTasks.filter((task) => task.status === "todo"),
					inProgress: userTasks.filter((task) => task.status === "inProgress"),
					done: userTasks.filter((task) => task.status === "done"),
				};
				setTasks(newTasks);
				//console.log("Updated tasks state:", newTasks); // Log to see the updated state
			} else {
				console.error("Error fetching tasks:", response);
				//setTasks({ backlog: [], todo: [], inProgress: [], done: [] }); // Fallback
			}
		} catch (error) {
			console.error(
				"Error fetching tasks:",
				error.response ? error.response.data : error
			);
		} finally {
			setLoading(false); // Set loading to false after fetching
		}
	};

	useEffect(() => {
		fetchTask(); // Initial fetch
	}, [fetchTask]);

	//formatting date
	const formatDate = (date) => {
		const day = date.getDate();
		const month = date.toLocaleString("en-GB", { month: "short" });
		const year = date.getFullYear();
		const daySuffix = getDaySuffix(day);
		return `${day}${daySuffix} ${month}, ${year}`;
	};

	//for day suffix eg-1st,2nd,3rd
	const getDaySuffix = (day) => {
		if (day > 3 && day < 21) return "th";
		switch (day % 10) {
			case 1:
				return "st";
			case 2:
				return "nd";
			case 3:
				return "rd";
			default:
				return "th";
		}
	};

	//date format
	useEffect(() => {
		const today = new Date();
		setCurrDate(formatDate(today));
		getTasks(selectedOption, setTasks, setError);
	}, [selectedOption]);

	// handle select option
	const handleSelectChange = (e) => {
		setSelectedOption(e.target.value);
		setMenuVisible({});
	};

	// handle add task
	const handlePlusAddClick = (task) => {
		setIsAddTask(true);
	};

	// handle cancelBtn in  add task
	const handleAddCancelTask = () => {
		setIsAddTask(false);
	};

	// handle add people
	const handleAddPeopleClick = () => {
		setIsAddPeople(true);
	};

	// handle cancelBtn in add people
	const handleAddPeopleCancelClick = () => {
		setIsAddPeople(false);
	};

	// toggle checkbox
	const toggleCheckBox = async (taskId, itemIndex, check, status) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				toast.error("Please login first");
				return;
			}
			const upadteTasks = { ...tasks };
			const task = upadteTasks.backlog
				.concat(upadteTasks.inProgress, upadteTasks.todo, upadteTasks.done)
				.find((task) => task._id === taskId);

			if (!task) {
				//toast.error("Task not found");
				return;
			}

			if (itemIndex !== undefined) {
				task.checkedList[itemIndex].completed = check;
			} else {
				task.status = status;
			}

			const res = await axios.patch(
				`${baseURL}task/updateChecklist/${taskId}`,
				task,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (res.status === 200) {
				// toast.success("Task updated successfully");
				getTasks(selectedOption, setTasks, setError);
			} else {
				console.error("Unexpected response:", res);
				toast.error("Failed to update task, Please try again");
			}
		} catch (error) {
			console.error("Error updating task:", error.res ? error.res.data : error);

			toast.error(
				`Failed to update task. Please try again. Error: ${
					error.res ? error.res.data : error.message
				}`
			);
		}
	};

	// truncate title of task
	const truncateTitle = (title, limit) => {
		if (title.length > limit) {
			return `${title.substring(0, limit)}...`;
		}
		return title; // Return the title if it doesn't exceed the limit
	};

	// toggle checklist visibility
	const toggleCheckListVisibilty = (taskId) => {
		setChecklistVisible((prev) => ({
			...prev,
			[taskId]: !prev[taskId],
		}));
	};

	// toggle menu visibility
	const togglemenuVissible = (taskId) => {
		setMenuVisible((prev) => ({
			...prev,
			[taskId]: !prev[taskId],
		}));
	};

	// handle delete task
	const handleClickDeleteTask = (taskId) => {
		setTaskToDelete(taskId);
		setIsDeleteTask(true);
		setMenuVisible((prev) => ({
			...prev,
			[taskId]: false,
		}));
	};

	// handle delete task
	const handleDeleteTask = () => {
		setIsDeleteTask(false);
		getTasks(selectedOption, setTasks, setError);
	};

	// handle edit task click btn menu visible
	const handleClickEdit = (task) => {
		setTaskToEdit(task);
		setIsEditTask(true);
		setMenuVisible((prev) => ({
			...prev,
			[task._id]: false,
		}));
	};

	// handle edit task
	const handleEditTask = () => {
		setIsEditTask(false);
		getTasks(selectedOption, setTasks, setError);
	};

	const formatdate = (date) => {
		const options = { day: "2-digit", month: "short" };
		return new Intl.DateTimeFormat("en-GB", options).format(new Date(date));
	};

	// handle share task link -- integrate frontend url here
	const handleShareClick = (taskId) => {
		const link = `https://pro-manage-sepia.vercel.app/share-task/${taskId}`;
		setPublicLink(link);
		navigator.clipboard
			.writeText(link)
			.then(() => {
				setlinkcopied(true);
				setTimeout(() => setlinkcopied(false), 4000);
			})
			.catch((err) => {
				console.error("Error copying link:", err);
				toast.error("Error copying link. Please try again");
			});
	};

	// handle link click states
	const handleLinkClick = () => {
		setNavigateToPublic(true);
	};

	// collapse all checklists
	const collapseAllCheckLists = (from) => {
		const updateVisiblity = {};
		tasks[from].forEach((task) => {
			updateVisiblity[task._id] = false;
		});
		setChecklistVisible((prev) => ({
			...prev,
			...updateVisiblity,
		}));
	};

	//console.log("before renderTask func Current tasks state:", tasks);

	const renderTask = (taskList = [], from) => {
		//error handling if tasklist is empty
		if (!Array.isArray(taskList)) {
			console.error(
				"Expected taskList to be an array, but received:",
				taskList
			);
			return <div className={styles.alertDiv}>No tasks available.</div>; // or return some fallback UI
		}
		if (taskList.length === 0) {
			return (
				<div className={styles.alertDiv}>
					No tasks available. Or wait till we load task...
				</div>
			);
		}

		const dueDateClass = (dueDate, taskStatus) => {
			// Remove the time component by setting hours, minutes, and seconds to zero
			const due = new Date(dueDate);
			due.setHours(0, 0, 0, 0);

			const today = new Date();
			today.setHours(0, 0, 0, 0);

			if (taskStatus === "done") return styles.completedDueDate;
			else if (due < today) return styles.pastDueDate;
			else return styles.currentDueDate;
		};

		return taskList.map((task, index) => {
			const dueClass = dueDateClass(task.duedate, task.status);
			const completedCount = task.checkedList
				? task.checkedList.filter((item) => item.completed).length
				: 0;
			const totalCnt = task.checkedList ? task.checkedList.length : 0;
			const truncatedTitle = truncateTitle(task.title, 10);
			let prioritySec = "";
			let dueDateSec = "";

			const dueDate = new Date(task.duedate);
			const today = new Date();

			//task duedate styling
			if (task.status === "done") {
				dueDateSec = styles.completedDueDate;
			} else if (dueDate < today) {
				dueDateSec = styles.pastDueDate;
			} else {
				dueDateSec = styles.currentDueDate;
			}

			//for swithcing between priority and styling
			prioritySec =
				task.selectedpriority === "HIGH PRIORITY"
					? styles.highPriority
					: task.selectedpriority === "MODERATE PRIORITY"
					? styles.mediumPriority
					: styles.lowPriority;

			return (
				<div key={task._id || index} className={styles.taskDetails}>
					<div className={styles.task1}>
						<div className={styles.stylePriority}>
							<span className={`${styles.priority} ${prioritySec}`}></span>
							<div className={styles.priorityName}>{task.selectedpriority}</div>
							{task.assignTo ? (
								<div className={styles.assignToIcon}>
									{task.assignTo.slice(0, 2).toUpperCase()}
								</div>
							) : null}
						</div>
						<div className={styles.dotIcon}>
							<PiDotsThreeOutlineBold
								onClick={() => togglemenuVissible(task._id)}
							/>
							{menuVisible[task._id] && (
								<div className={styles.dropDownMenu}>
									<div
										className={styles.dropDownMenuItem}
										task={taskToEdit}
										onClick={() => handleClickEdit(task)}>
										Edit
									</div>

									<div
										className={styles.dropDownMenuItem}
										onClick={() => handleShareClick(task._id)}>
										Share
									</div>

									<div
										className={styles.dropDownMenuItem}
										onClick={() => {
											handleClickDeleteTask(task._id);
											console.log("button Click", task._id);
										}}>
										Delete
									</div>
								</div>
							)}
						</div>
					</div>
					<div className={styles.taskTitle} data-title={task.title}>
						{truncatedTitle}
					</div>
					<div className={styles.checkList}>
						<div
							className={styles.checklistHeading}
							onClick={() => toggleCheckListVisibilty(task._id)}>
							CheckList({completedCount}/{totalCnt})
							{checklistVisible[task._id] ? (
								<>
									<IoIosArrowUp className={styles.iconstyle} />
								</>
							) : (
								<>
									<IoIosArrowDown className={styles.iconstyle} />
								</>
							)}
						</div>
						<div className={styles.listing}>
							{checklistVisible[task._id] && (
								<ul>
									{task.checkedList && task.checkedList.length > 0 ? (
										task.checkedList.map((item, index) => (
											<li key={index}>
												<input
													type="checkbox"
													checked={item.completed}
													className={styles.checkbox}
													onChange={(e) =>
														toggleCheckBox(task._id, index, e.target.checked)
													}
												/>
												{item.text}
											</li>
										))
									) : (
										<>No Items</>
									)}
								</ul>
							)}
						</div>
					</div>
					<div className={styles.allBtn}>
						<div>
							{task.duedate && (
								<button className={`${styles.dueDate} ${dueClass}`}>
									{formatdate(task.duedate)}
								</button>
							)}
						</div>
						<div className={styles.taskBtns}>
							{from !== "backlog" && (
								<button
									onClick={() =>
										toggleCheckBox(task._id, undefined, undefined, "backlog")
									}>
									BACKLOG
								</button>
							)}
							{from !== "todo" && (
								<button
									onClick={() =>
										toggleCheckBox(task._id, undefined, undefined, "todo")
									}>
									TO-DO
								</button>
							)}

							{from !== "inProgress" && (
								<button
									onClick={() =>
										toggleCheckBox(task._id, undefined, undefined, "inProgress")
									}>
									PROGRESS
								</button>
							)}
							{from !== "done" && (
								<button
									onClick={() =>
										toggleCheckBox(task._id, undefined, undefined, "done")
									}>
									DONE
								</button>
							)}
						</div>
					</div>
				</div>
			);
		});
	};

	// console.log("after renderTask func: ");
	// //Log current tasks before rendering
	// console.log(
	// 	"Current tasks state before calling actual renderTask function inside board.jsx default return :",
	// 	tasks
	// );

	return (
		<>
			<div className={styles.boardPg}>
				<div className={styles.introDiv}>
					<div className={styles.introNameDiv}>Welcome! {userName}</div>
					{linkcopied && (
						<div className={styles.linkCopied} onClick={handleLinkClick}>
							Link Copied
						</div>
					)}
					<div className={styles.currDate}>{currDate}</div>
				</div>
				<div className={styles.HeadContainer}>
					<div className={styles.boardContainer}>
						Board
						<span onClick={handleAddPeopleClick}>
							<GoPeople />
							Add People
						</span>
					</div>

					<div className={styles.selectOptionBox}>
						<select
							className={styles.filterOpt}
							value={selectedOption}
							onChange={handleSelectChange}>
							<option value="today" className={styles.opt}>
								Today
							</option>
							<option value="thisweek" className={styles.opt}>
								This Week
							</option>
							<option value="thismonth" className={styles.opt}>
								This Month
							</option>
						</select>
					</div>
				</div>
				{/* {console.log("Tasks to render:", tasks)} */}
				{loading ? (
					<div className={styles.alertDiv}>Loading tasks...</div> // Show loading message while tasks are being fetched
				) : (
					<>
						<div className={styles.taskContainer}>
							{/* Backlog code  */}
							<div className={styles.taskItemContainer}>
								<div className={styles.taskHeading}>
									BackLog
									<img
										src={collaspse}
										onClick={() => collapseAllCheckLists("backlog")}
										className={styles.icon}
									/>
								</div>
								<div className={styles.taskHolderBox}>
									<div className={styles.taskBox}>
										{renderTask(tasks.backlog, "backlog")}
									</div>
								</div>
							</div>

							{/* To do code */}
							<div className={styles.taskItemContainer}>
								<div className={styles.taskHeading}>
									To do
									<div className={styles.todoHeading}>
										<FaPlus
											style={{ width: "18px", height: "18px" }}
											onClick={handlePlusAddClick}
										/>
										<img
											src={collaspse}
											onClick={() => collapseAllCheckLists("todo")}
											className={styles.icon}
										/>
									</div>
								</div>
								{isAddTask && (
									<AddTask
										onCancel={handleAddCancelTask}
										onSave={(taskData) => {
											getTasks(selectedOption, setTasks, setError);
											setIsAddTask(false);
										}}
									/>
								)}
								<div className={styles.taskHolderBox}>
									<div className={styles.taskBox}>
										{renderTask(tasks.todo, "todo")}
									</div>
								</div>
							</div>

							{/* inProgress code */}
							<div className={styles.taskItemContainer}>
								<div className={styles.taskHeading}>
									In Progress
									<img
										src={collaspse}
										onClick={() => collapseAllCheckLists("inProgress")}
										className={styles.icon}
									/>
								</div>
								<div className={styles.taskHolderBox}>
									<div className={styles.taskBox}>
										{renderTask(tasks.inProgress, "inProgress")}
									</div>
								</div>
							</div>

							{/* //done code */}

							<div className={styles.taskItemContainer}>
								<div className={styles.taskHeading}>
									Done
									<img
										src={collaspse}
										onClick={() => collapseAllCheckLists("done")}
										className={styles.icon}
									/>
								</div>
								<div className={styles.taskHolderBox}>
									<div className={styles.taskBox}>
										{renderTask(tasks.done, "done")}
									</div>
								</div>
							</div>
						</div>
					</>
				)}
				{isAddPeople && <AddPeople onCancel={handleAddPeopleCancelClick} />}

				{isDeleteTask && (
					<DeleteTask
						taskId={taskToDelete}
						onDelete={handleDeleteTask}
						onClose={() => setIsDeleteTask(false)}
					/>
				)}
				{isEditTask && (
					<EditTask
						task={taskToEdit}
						onEdit={handleEditTask}
						onClose={() => setIsEditTask(false)}
					/>
				)}
			</div>
		</>
	);
}

export default Board;
