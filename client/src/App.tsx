import "./App.css";
import { ModalProvider } from "./utils/context";
import { Route, Routes } from "react-router-dom";
import {
  DuelScreen,
  FAQScreen,
  HistoryScreen,
  HomeScreen,
  RulesScreen,
} from "./pages";
import { WalletListener } from "./components/WalletListener";

function App() {
  return (
    <ModalProvider>
      <WalletListener>
        <Routes>
          <Route path={"/"} element={<HomeScreen />} />
          <Route path={"/duel"} element={<DuelScreen />} />
          <Route path={"/history"} element={<HistoryScreen />} />
          <Route path={"/rules"} element={<RulesScreen />} />
          <Route path={"/faq"} element={<FAQScreen />} />
        </Routes>
      </WalletListener>
    </ModalProvider>
  );
}

export default App;
