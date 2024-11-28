import React from 'react'
import { DNA } from "react-loader-spinner";

export const Loader = ({text}) => {
  return (
    <div style={{backgroundColor: 'white', height: "50vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", borderRadius: "5px"}}>
      <h1>Wait a minute</h1>
      <DNA
        visible={true}
        height="200"
        width="200"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
      />
    </div>
  );
}
