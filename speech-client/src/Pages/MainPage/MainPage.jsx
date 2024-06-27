import SpeechElement from "../../Components/SpeechElement";
import Cookies from "js-cookie";
import "./MainPage.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const MainPage = () => {
    const Navigate = useNavigate();
    

    useEffect(() => {
        if (!Cookies.get("jwtToken")) {
            Navigate("/NotFoundPage");
        }}, []);

    return (
        <div className="MainPage">
            <header>
                <h2 onClick={()=> Navigate("/Profile")}>
                    Переглянути прогрес
                </h2>
            </header>
            <SpeechElement />
        </div>
    );
};

export default MainPage;
