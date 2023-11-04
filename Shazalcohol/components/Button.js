import React from 'react';

const Button = (props) => {
    const buttonStyle = {
        display: 'flex',
        margin: 'auto',
        fontSize: '20px',
        padding: '10px 60px',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    return (
        <button style={buttonStyle}>
            {props.text}
        </button>
    );
}

export default Button;