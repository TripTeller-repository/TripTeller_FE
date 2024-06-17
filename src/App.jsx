import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./styles/reset.css";
import "./styles/font.css";
import "./styles/global.css";
import MainPage from "./pages/main/index.jsx";
import LoginPage from "./pages/login/index.jsx";
import MyTripPage from "./pages/mytrip/index.jsx";
import OurTrip from "./pages/ourtrip/index.jsx";
import Scrab from "./pages/mytrip/scrab/index.jsx";
import Details from "./pages/ourtrip/details/index.jsx";
import MakeTripPage from "./pages/maketrip/index.jsx";
import SignUpPage from "./pages/signup/index.jsx";
import RedirectPage from "./pages/login/loginRedirect.jsx";
import { useEffect } from "react";
import { useUserState } from "/src/hooks/useUserState";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mytrip" element={<MyTripPage />} />
        <Route path="/mytrip/scrab" element={<Scrab />} />
        <Route path="/ourtrip" element={<OurTrip />} />
        <Route path="/ourtrip/details" element={<Details />} />
        <Route path="/maketrip" element={<MakeTripPage />} />
        <Route path="/login/redirect" element={<RedirectPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </>,
    ),
  );

  const { fetchCurrentUser } = useUserState();
  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // 로컬스토리지에서 토큰 가져오기
    if (token && token !== null && token !== undefined) {
      fetchCurrentUser(); // 토큰이 있을 때만 사용자 정보 가져오기
    }
  }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
