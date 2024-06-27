import React from "react";
import Classes from "./BigButton.module.css"

const BigButton = (props) =>{


    return(
        <button className={Classes.BigButton} {...props}>
            {props.children}
        </button>
    )
}

export default BigButton