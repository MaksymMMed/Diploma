import React, { useEffect,useState } from "react";
import "./ProfilePage.css"
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { PointsService } from "../../API/PointsService";
import { UserService } from "../../API/UserService";
import LineChart from "../../Components/LineChart";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";

Chart.register(CategoryScale);

const ProfilePage = () =>{

    const Navigate = useNavigate()
    const pointsService = new PointsService();
    const [chartData, setChartData] = useState(null)


    useEffect(() => {
        const getUserPoints = async () => {
            try {
                const data = await pointsService.ReadPoints();
                const item = data.data
                return item

            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const checkTokenAndFetchUserData = async () => {
            try {
                if (!Cookies.get("jwtToken")) {
                    Navigate("/NotFoundPage");
                } else {
                    var points = await getUserPoints();
                    setChartData({
                        labels: points.map((data)  => data.date), 
                        datasets: [
                          {
                            label: "Points",
                            data: points.map((data) => data.points),
                            backgroundColor: [
                              "rgba(75,192,192,1)",
                              "#50AF95",    
                              "#f3ba2f",
                              "#2a71d0"
                            ],
                            borderColor: "black",
                            borderWidth: 2
                          }
                        ]
                      })
                }
            } catch (error) {
                console.error("Error checking token and fetching user data:", error);
            }
        };

        checkTokenAndFetchUserData();
    }, []);
    
    return(
        <div>
            <h2 onClick={()=>Navigate("/MainPage")} style={{margin:"15px 0 0 50px"}}>Повернутися назад</h2>
            <div>
                {chartData !== null && (
                <LineChart chartData={chartData} />
                )}
            </div>
        </div>
    )
}

export default ProfilePage