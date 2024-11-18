import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

export const Chart = () => {
  const data = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
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
    <div style={{ height: "300px", display: "flex", alignItems: "center", flexDirection: "column"}}>
        <h2>Medeedel deer analyze hiiv</h2>
      <Doughnut data={data} options={options} />
    </div>
  );
};
