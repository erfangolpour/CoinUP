import { useStore } from "@/stores/useCoinStore";
import { CoinDetails } from "@components/CoinDetails";
import { CoinList } from "@components/CoinList";
import { Layout } from "@components/Layout";
import { useTheme } from "@hooks/useTheme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	const { selectedCoin } = useStore();
	const { theme } = useTheme();

	return (
		<Layout>
			{selectedCoin ? <CoinDetails /> : <CoinList />}
			<ToastContainer
				position="bottom-center"
				autoClose={5000}
				closeOnClick
				theme={theme}
				limit={3}
			/>
		</Layout>
	);
}

export default App;
