import React, { useState } from "react";

let NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    
    return (
        <div className={`navbar-links ${isOpen ? "active" : ""}`}>
            <a href="BreathingTechniques">Breathing Techniques</a>
        </div>
    )
}

export default NavBar;