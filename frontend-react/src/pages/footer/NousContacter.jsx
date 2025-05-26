import React, { useState } from "react";
import "../styles/pages-info.css";

import { useTranslation } from 'react-i18next';

const NousContacter = () => {
    const { t } = useTranslation('contacter');
    return (
        <div className="nous-contacter">
            <h2>{t('title')}</h2>
            <p>
            {t('intro')}
            </p>
        
            <ul>
                <li>
                <strong>Antoine Crauser</strong> —{" "}
                <a
                    href="https://www.linkedin.com/in/antoine-crauser/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t('linkedIn')}
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
                    {t('linkedIn')}
                </a>
                </li>
            </ul>
        
            <p>
            {t('bug')}
            </p>
        </div>
    );
};

export default NousContacter;
