import { useStore } from "@/stores/useCoinStore";
import { CoinDetails } from "@components/CoinDetails";
import { CoinList } from "@components/CoinList";
import { Layout } from "@components/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	const { selectedCoin } = useStore();

	return (
		<Layout>
			{selectedCoin ? <CoinDetails /> : <CoinList />}
			<ToastContainer
				position="bottom-center"
				autoClose={5000}
				closeOnClick
				theme="dark"
				limit={3}
			/>
		</Layout>
	);
}

export default App;
