import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import baseURL from "../../Utils/url";
import styles from "../../Styles/OperationStyles/addTask.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import deletePng from "../../Images/Delete.png";
import toast from "react-hot-toast";
import { FaAngleDown } from "react-icons/fa";
function AddTask({ onSave, onCancel }) {
	const [title, setTitle] = useState("");
	const [priority, setPriority] = useState("");
	const [dueDate, setDueDate] = useState(null);
	const [checkedList, setCheckedList] = useState([]);
	const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(true);
	const [emails, setEmails] = useState([]); // State to store fetched emails
	const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility
	const refDatePicker = useRef(null);
	const refDatePickerContainer = useRef(null);

	// const [assignEmail, setAssignEmail] = useState("");
	// const [addPeople, setAddPeople] = useState([]);
	const [assignedEmail, setAssignedEmail] = useState(""); // State for assigned email

	//for datepicker
	useEffect(() => {
		if (refDatePicker.current && refDatePickerContainer.current) {
			const datePickerWidth = refDatePicker.current.offsetWidth;
			refDatePickerContainer.current.style.width = `${datePickerWidth}px`;
		}
	}, [isDatePickerVisible]);

	//to fetch emails
	useEffect(() => {
		const fetchEmails = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
					toast.error("Please login first");
					return;
				}

				// Decode token to get userId
				const tokenDecode = (token) => {
					try {
						const baseUrl = token.split(".")[1];
						const base = baseUrl.replace(/-/g, "+").replace(/_/g, "/");
						const jsonPayload = decodeURIComponent(
							atob(base)
								.split("")
								.map(
									(c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
								)
								.join("")
						);
						return JSON.parse(jsonPayload);
					} catch (error) {
						console.error("Error decoding token:", error);
						return null;
					}
				};

				const tokendecoded = tokenDecode(token);
				if (!tokendecoded || !tokendecoded.userId) {
					toast.error("Please login first");
					return;
				}

				const response = await axios.get(
					`${baseURL}auth/getAddpeople/${tokendecoded.userId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (response.status === 200) {
					setEmails(response.data.addPeople || []); // Set emails if found, else an empty array
				} else {
					toast.error("Failed to fetch emails");
				}
			} catch (error) {
				console.error("Error fetching emails:", error);
				toast.error("Failed to fetch emails");
			}
		};

		fetchEmails();
	}, []);

	// useEffect(() => {
	// 	const loadTaskData = async () => {
	// 		try {
	// 			const res = await axios.get(`${baseURL}task/taskData/${task._id}`);
	// 			const fetchedTask = res.data;
	// 			setPriority(fetchedTask.selectedpriority || "");
	// 			setAssignEmail(fetchedTask.assignTo || "");
	// 			setCheckedList(fetchedTask.checkedList || []);
	// 			// setDueDate(fetchedTask.duedate ? new Date(fetchedTask.dueDate) : null);
	// 			setDueDate(parseDate(fetchedTask.duedate));
	// 			setLoading(false);
	// 		} catch (error) {
	// 			console.error("Error fetching task data:", error);
	// 			setError("Failed to fetch task data");
	// 			setLoading(false);
	// 		}
	// 	};

	// 	const loadUserData = async () => {
	// 		try {
	// 			const userId = localStorage.getItem("userId");
	// 			const token = localStorage.getItem("token");
	// 			if (!userId || !token) {
	// 				toast.error("Please login first");
	// 				setError("User not authenticated");
	// 				return;
	// 			}
	// 			const res = await axios.get(`${baseURL}auth/userdata/${userId}`, {
	// 				headers: {
	// 					Authorization: `Bearer ${token}`,
	// 				},
	// 			});
	// 			const user = res.data;
	// 			setAddPeople(user.addPeople || []);
	// 		} catch (error) {
	// 			console.error("Error fetching user data:", error);
	// 			setError("Failed to fetch user data");
	// 		}
	// 	};
	// 	if (task._id) {
	// 		loadUserData();
	// 	}
	// 	loadTaskData();
	// }, [task._id]);

	//handle save btn
	const handleSaveBtn = async () => {
		if (title.trim() !== " " && priority !== "" && checkedList.length > 0) {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
					toast.error("Please login first");
					return;
				}
				const tokenDecode = (token) => {
					try {
						const baseUrl = token.split(".")[1];
						const base = baseUrl.replace(/-/g, "+").replace(/_/g, "/");
						const jsonPayload = decodeURIComponent(
							atob(base)
								.split("")
								.map((c) => {
									return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
								})
								.join("")
						);
						return JSON.parse(jsonPayload);
					} catch (error) {
						console.error("Error decoding token :", error);
						return null;
					}
				};

				const tokendecoded = tokenDecode(token);
				if (!tokendecoded || !tokendecoded.userId) {
					toast.error("Please login first");
					return;
				}

				const taskData = {
					title,
					selectedpriority: priority,
					checkedList,
					userId: tokendecoded.userId,
					assignTo: assignedEmail,
				};

				if (dueDate) {
					taskData.duedate = dueDate;
				}

				const res = await axios.post(`${baseURL}task/create`, taskData, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (res.status === 201) {
					toast.success("Task created successfully");
					onSave(res.data);
					setTitle("");
					setPriority("");
					setDueDate(null);
					setCheckedList([]);
					setIsDatePickerVisible(false);
					setAssignedEmail("");
					onCancel();
				} else {
					console.error("Unexpected response:", res);
					toast.error("Failed to create task, Please try again");
				}
			} catch (error) {
				console.error(
					"Error creating task:",
					error.res ? error.res.data : error
				);
				toast.error("Failed to create task, Please try again");
			}
		} else {
			toast.error("Please fill all the fields");
		}
	};
	

	const handleCancelBtn = () => {
		onCancel();
		setTitle("");
		setPriority("");
		setCheckedList([]);
		setDueDate(null);
		setIsModalOpen(false); // Close the modal
		setIsDatePickerVisible(false);
	};

	// const handleAssignToChange = (e) => {
	// 	setAssignedEmail(e.target.value); // Update selected email
	// };

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	// Handle email selection
	const handleEmailSelect = (email) => {
		setAssignedEmail(email);
		setIsDropdownOpen(false);
		console.log("Assigned email set to:", email);
	};

	// const handleAssignEmail = (email) => {
	// 	setAssignEmail(email);
	// 	setIsDropdownOpen(false);
	// };

	const getInitials = (email) => {
		const [firstName, domain] = email.split("@");
		return firstName.slice(0, 2).toUpperCase();
	};

	// Monitor assigned email changes
	useEffect(() => {
		console.log("Assigned Email Updated:", assignedEmail);
	}, [assignedEmail]); // Log whenever assignedEmail changes

	const handleDropdownClickOutside = (e) => {
		if (!e.target.closest(`.${styles.dropdownContainer}`)) {
			setIsDropdownOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleDropdownClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleDropdownClickOutside);
		};
	}, []);

	const handleChangeCheckList = (index, value) => {
		const newCheckList = [...checkedList];
		if (newCheckList[index]) {
			// Check if item exists at index
			newCheckList[index].text = value;
			setCheckedList(newCheckList);
		}
	};

	const isLastCheckedlistItemFilled =
		checkedList.length === 0 ||
		checkedList[checkedList.length - 1].text.trim() !== "";

	const addCheckListItem = () => {
		if (isLastCheckedlistItemFilled) {
			setCheckedList([...checkedList, { text: "", completed: false }]);
		}
	};

	const handleRemoveCheckListItem = (index) => {
		const newCheckList = checkedList.filter((_, i) => i !== index);
		setCheckedList(newCheckList);
	};

	const togglingCheckListItems = (index) => {
		const newCheckList = [...checkedList];
		newCheckList[index].completed = !newCheckList[index].completed;
		setCheckedList(newCheckList);
	};

	const handleChangeDate = (date) => {
		setDueDate(date);
		setIsDatePickerVisible(false);
	};

	const handleDatePickerCancelBtn = () => {
		setIsDatePickerVisible(false);
	};

	return isModalOpen ? (
		<div className={styles.modalContainer}>
			<div className={styles.modalItems}>
				<div>
					<label className={styles.titleBox}>
						{" "}
						Title <span className={styles.requiredField}> *</span>
					</label>
					<br />
					<input
						type="text"
						value={title}
						placeholder="Enter Task Title"
						className={styles.inputField}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</div>
				<div className={styles.priorityField}>
					<div className={styles.priorityName}>
						Select Priority <span className={styles.requiredField}>*</span>
					</div>
					<div className={styles.priorityBtns}>
						<button
							className={priority === "HIGH PRIORITY" ? styles.selected : ""}
							onClick={() => setPriority("HIGH PRIORITY")}>
							<div className={styles.highPriorityCircle}></div>
							HIGH PRIORITY
						</button>
						<button
							className={
								priority === "MODERATE PRIORITY" ? styles.selected : ""
							}
							onClick={() => setPriority("MODERATE PRIORITY")}>
							<div className={styles.moderatePriorityCircle}></div>
							MODERATE PRIORITY
						</button>
						<button
							className={priority === "LOW PRIORITY" ? styles.selected : ""}
							onClick={() => setPriority("LOW PRIORITY")}>
							<div className={styles.lowPriorityCircle}></div>
							LOW PRIORITY
						</button>
					</div>
				</div>

				{/* emails   */}
				<div className={styles.assignToContainer}>
					<div className={styles.asignToName}>Assign to</div>
					<div className={styles.dropdownContainer}>
						<input
							type="text"
							value={assignedEmail || "Select assignee"}
							onClick={toggleDropdown}
							readOnly
							className={styles.inputFieldAssign}
						/>
						<FaAngleDown
							className={styles.dropdownIcon}
							onClick={toggleDropdown}
						/>
						{isDropdownOpen && (
							<div className={styles.dropdownMenu}>
								{emails.map((email, index) => (
									<div key={index} className={styles.dropdownItem}>
										<div className={styles.emailCircle}>
											<div className={styles.emailName}>
												{email.slice(0, 2).toUpperCase()}
											</div>
										</div>
										<span className={styles.email}>{email}</span>
										<button
											className={styles.assignBtn}
											onClick={(e) => {
												console.log("Dropdown item clicked:", email); // Check if this logs the email
												handleEmailSelect(email, e);
												console.log("button click");
											}}>
											Assign
										</button>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* <div className={styles.assignToContainer}>
					<label>Assign to</label>
					<div className={styles.dropDownConatiner}>
						<button
							className={styles.dropDownBtn}
							onClick={() => {
								setIsDropdownOpen(!isDropdownOpen);
							}}>
							{assignEmail ? assignEmail : "Select Assignee"}
						</button>
						{isDropdownOpen && (
							<div className={styles.dropDownMenu}>
								{addPeople.map((email, index) => (
									<div key={index} className={styles.dropDownItem}>
										<div className={styles.emailCircle}>
											{getInitials(email)}
										</div>
										<div className={styles.emailName}>{email}</div>
										<button
											className={styles.assignBtn}
											onClick={() => {
												handleAssignEmail(email);
											}}>
											Assign
										</button>
									</div>
								))}
							</div>
						)}
					</div>
				</div> */}

				{/* Checklist   */}
				<div>
					<p className={styles.checkListCount}>
						CheckList ({checkedList.filter((item) => item.completed).length}/
						{checkedList.length}){" "}
						<span className={styles.requiredField}>*</span>
					</p>
					<div className={styles.checkedListData}>
						{checkedList.map((item, index) => (
							<div key={index} className={styles.checkListItems}>
								<input
									type="checkbox"
									checked={item.completed}
									onChange={() => togglingCheckListItems(index)}
								/>

								<input
									type="text"
									value={item.text}
									onChange={(e) => handleChangeCheckList(index, e.target.value)}
									placeholder="Add a task"
								/>
								<button
									onClick={() => {
										console.log("Rendering AddTask component");
										handleRemoveCheckListItem(index);
									}}>
									<div>
										<img className={styles.deleteIcon} src={deletePng} />
									</div>
								</button>
							</div>
						))}
					</div>
					<button
						className={styles.addNewBtn}
						onClick={addCheckListItem}
						disabled={
							checkedList.length > 0 &&
							checkedList[checkedList.length - 1].text.trim() === ""
						}
						//disabled={!isLastCheckedlistItemFilled}
					>
						+Add New
					</button>
				</div>
				<div className={styles.btnsGroup}>
					<button
						onClick={() => setIsDatePickerVisible(true)}
						className={styles.dateBtn}>
						{dueDate
							? `${dueDate.toLocaleDateString("en-GB")}`
							: "Select Due Date"}
					</button>
					{isDatePickerVisible && (
						<div
							ref={refDatePickerContainer}
							className={styles.datePickerContainer}>
							<DatePicker
								selected={dueDate}
								onChange={handleChangeDate}
								showYearDropdown
								showMonthDropdown
								dropdownMode="select"
								className={styles.datePickerComp}
								inline
								ref={refDatePicker}
								placeholderText="Select Due Date"
							/>
							<button
								className={styles.datePickerCancelBtn}
								onClick={handleDatePickerCancelBtn}>
								Cancel
							</button>
						</div>
					)}
					<div className={styles.cancelsaveBtns}>
						<button onClick={handleCancelBtn} className={styles.cancelBtn}>
							Cancel
						</button>
						<button onClick={handleSaveBtn} className={styles.saveBtn}>
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	) : null;
}

export default AddTask;
