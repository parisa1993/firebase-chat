import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/Auth";
import Navigation from "./components/Navigation";
import Routes from "./route/Routes";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <Routes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
