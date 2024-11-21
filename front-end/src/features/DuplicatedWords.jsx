import React from "react";

export const DuplicatedWords = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div
        style={{
          height: "100px",
          overflowY: "auto",
          backgroundColor: "gray",
          margin: "5px 30px",
          padding: "5px",
          color: "white",
          textAlign: "center",
        }}
      >
        Давхардсан үг олдсонгүй.
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100px",
        overflowY: "auto",
        backgroundColor: "gray",
        margin: "5px 30px",
        padding: "5px",
        color: "white",
      }}
    >
      <ul>
        {Object.entries(data).map(([key, value]) => (
          <li key={key}>
            {key}: {value}
          </li>
        ))}
      </ul>
    </div>
  );
};
