import "./App.css";
import NavBar from "./components/NavBar";
import { Outlet } from "react-router-dom";

function App() {

  return (
    <div className="app-layout">
      <NavBar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );

}

export default App;
