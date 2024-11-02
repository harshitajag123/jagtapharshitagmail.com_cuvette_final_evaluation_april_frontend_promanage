import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import TaskPage from "./Pages/TaskPage";
import ShareTask from "./Pages/ShareTask";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";

function App() {
	return (
		<>
			<Toaster
				toastOptions={{
					success: {
						iconTheme: {
							primary: "#38e667",
							secondary: "white",
						},
						style: {
							color: "#38e667",
						},
					},
					error: {
						iconTheme: {
							primary: "#ff7373",
							secondary: "white",
						},
						style: {
							color: "#ff7373",
						},
					},
				}}
			/>
			<BrowserRouter>
				<Routes>
					<Route path="/homepage" element={<HomePage />}></Route>
					<Route path="/" element={<HomePage />}></Route>
					<Route path="/taskpage" element={<TaskPage />}></Route>
					<Route path="/share-task/:id" element={<ShareTask />}></Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
