import { ToastContainer } from "react-toastify";
import { Layout } from "./components/Layout";
import { useStore } from "./stores/useStore";
import { CoinList } from "./components/CoinList";
import { CoinDetail } from "./components/CoinDetail";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { selectedCoin } = useStore();

  return (
    <Layout>
      {selectedCoin ? <CoinDetail /> : <CoinList />}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        closeOnClick
        theme="dark"
      />
    </Layout>
  );
}

export default App;
