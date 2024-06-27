import React, {useState,useEffect} from "react";

const Point = ({item}) =>{

    const formattedDateTime = new Date(item.date).toLocaleString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

    return(
        <div style={{display:"flex",justifyContent:"space-between",width:"350px",height:"60px",background:"white",marginTop:"25px",padding:" 0 15px 0 15px"
        ,borderRadius:"15px"}}>
            <p>Оцінка: {item.points}</p>
            <p>Дата: {formattedDateTime}</p>
            <p>Текст: {item.textToSay}</p>

        </div>
    )
}

export default Point