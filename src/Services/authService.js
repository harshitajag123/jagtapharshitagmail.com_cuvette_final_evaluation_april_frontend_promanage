// import baseURL from "../Utils/url";
// import axios from "axios";

// // export const loginUser = async (data) => {
// // 	try {
// // 		const response = await axios.post(`${baseURL}auth/login`, data);
// // 		return response.data;
// // 	} catch (error) {
// // 		return error.response.data;
// // 	}
// // };

// // Login User
// export const loginUser = async (data) => {
// 	try {
// 		const response = await axios.post(`${baseURL}auth/login`, data);
// 		return response.data; // Success case
// 	} catch (error) {
// 		// Handle 401 Unauthorized
// 		if (error.response) {
// 			if (error.response.status === 401) {
// 				return { status: 'error', code: 401, message: 'Unauthorized! Please register first.' };
// 			}
// 			// Other status codes
// 			return { status: 'error', code: error.response.status, message: error.response.data.message || "Login failed" };
// 		}
// 		// Network or other errors
// 		return { status: 'error', message: error.message || "Login failed" };
// 	}
// };

// export const RegisterUser = async (data) => {
// 	try {
// 		const response = await axios.post(`${baseURL}auth/register`, data);
// 		return response.data;
// 	} catch (err) {
// 		return err.response.data;
// 	}
// };

// export const getUserData = async (userId, token) => {
// 	try {
// 		const response = await axios.get(`${baseURL}auth/userdata/${userId}`, {
// 			headers: {
// 				Authorization: `Bearer ${token}`,

// 			},
// 		});
// 		return response;
// 	} catch (err) {
// 		console.error("error fetching user data:", err);
// 		throw err;
// 	}
// };

import baseURL from "../Utils/url";
import axios from "axios";

// Login User
export const loginUser = async (data) => {
	try {
		const response = await axios.post(`${baseURL}auth/login`, data);
		return response.data; // Success case
	} catch (error) {
		// Handle different error scenarios
		if (error.response) {
			// Specific status code handling
			const { status, data } = error.response;
			if (status === 401) {
				return {
					status: "error",
					code: 401,
					message: "Unauthorized! Please register first.",
				};
			}
			return {
				status: "error",
				code: status,
				message: data.message || "Login failed",
			};
		} else if (error.request) {
			// Network error
			return {
				status: "error",
				message: "Network error, please try again later.",
			};
		} else {
			// Other errors
			return {
				status: "error",
				message: error.message || "An unknown error occurred.",
			};
		}
	}
};

// Register User
export const RegisterUser = async (data) => {
	try {
		const response = await axios.post(`${baseURL}auth/register`, data);
		//console.log("Register data:", data);
		return response.data;
	} catch (error) {
		if (error.response) {
			// Error from server response
			return {
				status: "error",
				code: error.response.status,
				message: error.response.data.message || "Registration failed",
			};
		} else if (error.request) {
			// Network error or server unreachable
			return {
				status: "error",
				message: "Network error, please try again later.",
			};
		} else {
			// Unknown error
			return {
				status: "error",
				message: error.message || "An unknown error occurred.",
			};
		}
	}
};

// Get User Data
export const getUserData = async (userId, token) => {
	try {
		const response = await axios.get(`${baseURL}auth/userdata/${userId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching user data:", error);
		if (error.response) {
			return {
				status: "error",
				code: error.response.status,
				message: error.response.data.message || "Failed to fetch user data",
			};
		} else if (error.request) {
			return {
				status: "error",
				message: "Network error, please try again later.",
			};
		} else {
			return {
				status: "error",
				message: error.message || "An unknown error occurred.",
			};
		}
	}
};
