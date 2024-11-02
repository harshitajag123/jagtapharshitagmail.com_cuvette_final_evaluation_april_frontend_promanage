import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import baseURL from "../../Utils/url";
import styles from "../../Styles/OperationStyles/editTask.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import deletePng from "../../Images/Delete.png";
import toast from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import { FaAngleDown } from "react-icons/fa";

function EditTask({ task, onEdit, onClose }) {
	const [title, setTitle] = useState("");
	const [priority, setPriority] = useState("");
	const [assignEmail, setAssignEmail] = useState("");
	const [dueDate, setDueDate] = useState(null);
	const [checkedList, setCheckedList] = useState([]);
	const [checklistToDelete, setChecklistToDelete] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [addPeople, setAddPeople] = useState([]);
	const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(true);
	const [emails, setEmails] = useState([]); // State to store fetched emails
	const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility

	const refDatePicker = useRef(null);
	const refDatePickerContainer = useRef(null);
	//for datepicker
	useEffect(() => {
		if (refDatePicker.current && refDatePickerContainer.current) {
			const datePickerWidth = refDatePicker.current.offsetWidth;
			refDatePickerContainer.current.style.width = `${datePickerWidth}px`;
		}
	}, [isDatePickerVisible]);

	const parseDate = (dateString) => {
		const date = new Date(dateString);
		return isNaN(date) ? null : date;
	};

	//to load task data and load user data
	useEffect(() => {
		const loadTaskData = async () => {
			try {
				const res = await axios.get(`${baseURL}task/taskData/${task._id}`);
				const fetchedTask = res.data;
				setPriority(fetchedTask.selectedpriority || "");
				setAssignEmail(fetchedTask.assignTo || "");
				setCheckedList(fetchedTask.checkedList || []);
				// setDueDate(fetchedTask.duedate ? new Date(fetchedTask.dueDate) : null);
				setDueDate(parseDate(fetchedTask.duedate));
				setLoading(false);
			} catch (error) {
				console.error("Error fetching task data:", error);
				setError("Failed to fetch task data");
				setLoading(false);
			}
		};

		const loadUserData = async () => {
			try {
				const userId = localStorage.getItem("userId");
				const token = localStorage.getItem("token");
				if (!userId || !token) {
					toast.error("Please login first");
					setError("User not authenticated");
					return;
				}
				const res = await axios.get(`${baseURL}auth/userdata/${userId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const user = res.data;
				setAddPeople(user.addPeople || []);
			} catch (error) {
				console.error("Error fetching user data:", error);
				setError("Failed to fetch user data");
			}
		};
		if (task._id) {
			loadUserData();
		}
		loadTaskData();
	}, [task._id]);

	
	const handleCheckedListChange = (index, value) => {
		const newCheckList = [...checkedList];
		newCheckList[index].text = value;
		setCheckedList(newCheckList);
	};

	const addCheckedListItem = () => {
		if (
			checkedList.length === 0 ||
			checkedList[checkedList.length - 1].text.trim() !== ""
		) {
			setCheckedList([...checkedList, { text: "", completed: false }]);
		}
	};

	const removeCheckedListItem = (index) => {
		const itemToDel = checkedList[index];
		if (itemToDel._id) {
			setCheckedList([...checklistToDelete, itemToDel._id]);
		}
		const newCheckedList = checkedList.filter((_, i) => i !== index);
		setCheckedList(newCheckedList);
	};

	const toggleCheckListItem = (index) => {
		const newCheckedList = [...checkedList];
		newCheckedList[index].completed = !newCheckedList[index].completed;
		setCheckedList(newCheckedList);
	};

	const handleDateChange = (date) => {
		setDueDate(date);
		setIsDatePickerVisible(false);
	};
	const handleDatePickerCancelBtn = () => {
		setIsDatePickerVisible(false);
	};
	const isLastCheckedlistItemFilled =
		checkedList.length === 0 ||
		checkedList[checkedList.length - 1].text.trim() !== "";

	const handleSaveBtn = async () => {
		try {
			const token = localStorage.getItem("token");
			const userId = localStorage.getItem("userId");
			if (!token) {
				toast.error("Please login first");
				return;
			}
			await axios.patch(
				`${baseURL}task/updateAll/${task._id}`,
				{
					title,
					selectedpriority: priority,
					assignTo: assignEmail,
					checkedList,
					duedate: dueDate,
					checklistToDelete,
					userId,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			toast.success("Task updated successfully");
			onEdit();
			onClose();
		} catch (error) {
			console.error("Error updating task:", error);
			setError("Failed to update task, Please try again");
			toast.error("Failed to update task, Please try again");
		}
	};

	const getInitials = (email) => {
		const [firstName, domain] = email.split("@");
		return firstName.slice(0, 2).toUpperCase();
	};

	const handleAssignEmail = (email) => {
		setAssignEmail(email);
		setIsDropdownOpen(false);
	};

	return (
		<>
			<div>EditTask</div>
			<div className={styles.modalContainer}>
				<div className={styles.modalItems}>
					<div className={styles.modalContainer}>
						<div className={styles.modalItems}>
							<div>
								<label className={styles.title}>
									Title <span className={styles.requiredField}>*</span>
									<br />
								</label>
								<input
									className={styles.inputField}
									placeholder="Enter Task Title"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									required
								/>
							</div>
							<div className={styles.priorityField}>
								<div className={styles.priorityName}>
									Select Priority{" "}
									<span className={styles.requiredField}>*</span>
								</div>
								<div className={styles.priorityBtns}>
									<button
										className={
											priority === "HIGH PRIORITY" ? styles.selected : ""
										}
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
										className={
											priority === "LOW PRIORITY" ? styles.selected : ""
										}
										onClick={() => setPriority("LOW PRIORITY")}>
										<div className={styles.lowPriorityCircle}></div>
										LOW PRIORITY
									</button>
								</div>
							</div>
							<div className={styles.assignToContainer}>
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
							</div>
							<div>
								<p className={styles.checkListCount}>
									CheckList (
									{checkedList.filter((item) => item.completed).length}/
									{checkedList.length}){" "}
									<span className={styles.requiredField}>*</span>
								</p>
								<div className={styles.checkedListData}>
									{checkedList.map((item, index) => (
										<div key={index} className={styles.checkedListItems}>
											<input
												type="checkbox"
												checked={item.completed}
												onChange={() => toggleCheckListItem(index)}
											/>
											<input
												type="text"
												value={item.text}
												onChange={(e) =>
													handleCheckedListChange(index, e.target.value)
												}
												placeholder="Add a task"
											/>
											<button
												onClick={() => {
													removeCheckedListItem(index);
												}}>
												<img src={deletePng} className={styles.deleteIcon} />
											</button>
										</div>
									))}
								</div>
								<button
									className={styles.addNewBtn}
									onClick={addCheckedListItem}
									// disabled={!isLastCheckedlistItemFilled}
								>
									{" "}
									+ Add New{" "}
								</button>
							</div>
							<div className={styles.btnsGroup}>
								<button
									className={styles.dateBtn}
									onClick={() => {
										setIsDatePickerVisible(true);
									}}>
									{dueDate
										? dueDate.toLocaleDateString("en-GB")
										: "Select Due Date"}
								</button>

								{isDatePickerVisible && (
									<div
										ref={refDatePickerContainer}
										className={styles.datePickerContainer}>
										<DatePicker
											selected={dueDate}
											onChange={handleDateChange}
											showYearDropdown
											showMonthDropdown
											dropdownMode="select"
											className={styles.datePickerComp}
											inline
											ref={refDatePicker}
											placeholderText="Select Due Date"
										/>
										<button
											onClick={handleDatePickerCancelBtn}
											className={styles.datePickerCancelBtn}>
											Cancel
										</button>
									</div>
								)}

								<div className={styles.cancelSaveBtns}>
									<button onClick={onClose} className={styles.cancelBtn}>
										Cancel
									</button>
									<button onClick={handleSaveBtn} className={styles.saveBtn}>
										Save
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default EditTask;
