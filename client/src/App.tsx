import "./App.css";
import { Modal } from "./components/Modal";
import { ModalProvider } from "./utils/context";
import { Route, Routes } from "react-router-dom";
import {
  DuelScreen,
  FAQScreen,
  HistoryScreen,
  HomeScreen,
  RulesScreen,
} from "./pages";

function App() {
  return (
    <ModalProvider>
      <Modal />
      <Routes>
        <Route path={"/"} element={<HomeScreen />} />
        <Route path={"/duel"} element={<DuelScreen />} />
        <Route path={"/history"} element={<HistoryScreen />} />
        <Route path={"/rules"} element={<RulesScreen />} />
        <Route path={"/faq"} element={<FAQScreen />} />
      </Routes>
    </ModalProvider>
  );
}

export default App;
