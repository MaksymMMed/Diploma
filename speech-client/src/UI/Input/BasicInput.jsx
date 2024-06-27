import React from "react";
import Classes from './BasicInput.module.css'

const BasicInput = (props) =>
{
    return(
            <input  className= {Classes.BasicInput} {...props} type="text"></input>
    )
}

export default BasicInput