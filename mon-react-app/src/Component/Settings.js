import React, { useState, useEffect } from "react";
import Navigation from './Nav'

const Settings = () => {
    return (
        <div>
            <Navigation/>
            <h1>Informations personnelles</h1>
            <h2>Username :</h2>
            <h2>Email :</h2>
            <h2>Changer votre mot de passe</h2>
        </div>
    );

};

export default Settings;