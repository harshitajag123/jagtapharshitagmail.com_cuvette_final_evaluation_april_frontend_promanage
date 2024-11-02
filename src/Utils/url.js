// utils/url.js

const baseURL =
	process.env.NODE_ENV === "production"
		? "https://pro-manage-fqmi.onrender.com/api/"
		: "http://localhost:3000/api/";

export default baseURL;
