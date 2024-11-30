import React from "react";

export const DuplicatedWords = ({ data }) => {
  return (
    <div style={{height: "100px", overflowY: "auto", backgroundColor: "gray", margin: "5px 30px 5px 30px", overflowX: "auto", padding: "5px", color: "white"}}>
      <ul>
        {Object.keys(data).map((key) => (
          <li key={key}>
            {key}: {data[key]}
          </li>
        ))}
      </ul>
    </div>
  );
};
