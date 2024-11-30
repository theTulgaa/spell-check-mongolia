import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

export const Chart = ({data}) => {
  const data1 = {
    labels: ["entertainment", "finance", "health", "history", "politic", "sport"],
    datasets: [
      {
        label: "My First Dataset",
        data: data,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(255, 205, 100)",
          "rgb(255, 100, 86)",
          "rgb(100, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div style={{ height: "300px", display: "flex", alignItems: "center", flexDirection: "column", marginTop: "20px" }}>
        <h2>Шинжилгээ хийв.</h2>
      <Doughnut data={data1} options={options} />
    </div>
  );
};
