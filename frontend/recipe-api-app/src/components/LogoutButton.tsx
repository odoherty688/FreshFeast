import React from 'react';

const handleLogout = async () => {
    const domain = "freshfeast-40300091.uk.auth0.com";
    const clientId = "DRFE4bVlsPQZJ4PFQ5P5N0oU0g4Dp676"; 
    const returnTo = "http://localhost:3000";

    const response = await fetch(
        `https://${domain}/logout?${clientId}&returnTo=${returnTo}`,
        { redirect: "manual" }
    );

    window.location.replace(response.url);
}

const LogoutButton = () => {
    return (
        <></>
    )
}

export default LogoutButton;