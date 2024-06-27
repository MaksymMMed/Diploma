import React, {useState,useEffect} from "react";

const DetailedPoint = ({points}) =>{

  return(
  <div>
        <p>Середній бал: {points.points}/100</p>
        <p>Фраза: {points.word}</p>
        <p>Фонеми: {points.wordPhonemes}</p>
        <div style={{ display: "flex", flexWrap: "wrap", maxWidth:"80%",margin:"auto" }}>
        {points.phonemes.map((item, index) => {
          const [phoneme, score] = item.match(/([A-Z]+)\(([\d.]+)\)/).slice(1, 3);
          return (
            <div key={index} style={{border:"1px solid gray",margin:"5px 5px 0 5px",padding:"5px 5px 5px 5px" ,minWidth:"65px", width:"10%",height:"10%"}}>
              <p>Фонема: {phoneme}</p>
              <p>Бали: {Math.floor(score*100)}</p>
            </div>
          );
        })}
        </div>
        {/* <div style={{ display: "flex", flexWrap: "wrap", maxWidth:"80%",margin:"auto" }}>
        {points.phoneTime.map((item, index) => (
      <div key={index} style={{ margin: "10px", border: "1px solid #ccc", padding: "10px" }}>
        <p>Phoneme: {item[0]}</p>
        <p>Start: {item[1]}</p>
        <p>End: {item[2]}</p>
      </div>
    ))}
        </div> */}
  </div>
  ) 
}

export default DetailedPoint