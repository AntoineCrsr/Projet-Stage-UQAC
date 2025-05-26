import React from "react";
import "../styles/pages-info.css";

import { useTranslation } from 'react-i18next';

const NotreEquipe = () => {
    const { t } = useTranslation('equipe');
    return (
        <div className="notre-equipe">
        <h1>{t('title')}</h1>
        <p>
        {t('paragraph1')}
        </p>

        <p>
        {t('paragraph2')}
        </p>
        </div>
    );
};

export default NotreEquipe;