import { useState, useEffect } from "react";
import "./App.css";
import { Chart } from "./features/Chart";
import { MdContentCopy } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { BsFileText } from "react-icons/bs";
import { DuplicatedWords } from "./features/DuplicatedWords";

const VerticalDivider = () => {
  return <div className="vertical-divider" />;
};

export const App = () => {

  const data = {
    word1: 5,
    word2: 10,
    word3: 10,
    word4: 5,
    word5: 10,
    word6: 10,
    word7: 5,
    word8: 10,
    word9: 10,
  };
  return (
    <>
      <div className="main-con">
        {/* text bichih bolon shalgah tovch ntr bairlah container */}
        <div className="left-con">
          <h1 className="header-text">Saijirdiin baigazde ats ve</h1>

          <textarea className="text-area" placeholder="Enter text here..."/>

          {/* 3 tovch hiigeed heden ug heden temdegt orsong tooloh container */}

          <div className="three-btn-con">
            {/* 3 button heseg yvj bn */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <MdContentCopy size={33} />
              <VerticalDivider />
              <MdDeleteOutline size={40} />
              <VerticalDivider />
              <BsFileText size={30} />
            </div>
            {/* heden ug heden useg orson heseg */}
            <div className="count-word-letter-con">
              <div className="">0/50 words</div>
              <div className="">0/800 letters</div>
            </div>
          </div>
          <div style={{display: "flex", alignItems: "center", justifyContent: "center", marginTop: "20px"}}>
            <button className="analyze-btn">Analyze</button>
          </div>
        </div>

        {/*  Medeeelliin dun shinjilgee, davhardsan ug zereg code ene containerd bairlana*/}

        <div className="right-con">
          <Chart />
          <p style={{marginTop: "40px", marginLeft: "30px"}}>Davhardsan ugiin jagsaalt</p>
          <DuplicatedWords data={data} />
          <div className="count-mis-word-con">
            <span>45 / 50</span>
            <p>Aldaanii unelgee</p>
          </div>
        </div>
      </div>
    </>
  );
};
