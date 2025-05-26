import React, { useState } from "react";
import "../styles/pages-info.css";

const NousContacter = () => {
    return (
        <div className="nous-contacter">
            <h2>Nous contacter</h2>
            <p>
                Une question, une suggestion, ou besoin d’aide ? Vous pouvez nous
                contacter directement sur nos profils LinkedIn :
            </p>
        
            <ul>
                <li>
                <strong>Antoine Crauser</strong> —{" "}
                <a
                    href="https://www.linkedin.com/in/antoine-crauser/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Voir le profil LinkedIn
                </a>
                </li>
                <li>
                <br />
                <strong>Victor Jost</strong> —{" "}
                <a
                    href="https://www.linkedin.com/in/victor-jost-562420255/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Voir le profil LinkedIn
                </a>
                </li>
            </ul>
        
            <p>
                Vous pouvez également signaler un bug ou un problème via les liens en
                bas de page.
            </p>
        </div>
    );
};

export default NousContacter;
