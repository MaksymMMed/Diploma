// components/LineChart.js
import React from "react";
import { Line } from "react-chartjs-2";
function LineChart({ chartData }) {
  return (
    <div className="chart-container" style={{width:"80%"}}>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Прогрес користувача"
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
}
export default LineChart;