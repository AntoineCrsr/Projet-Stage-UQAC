import React from "react";
import "../styles/pages-info.css";

import { useTranslation } from 'react-i18next';

const APropos = () => {
    const { t } = useTranslation('apropos');
    return (
        <div className="a-propos">
        <h1>{t("title")}</h1>
        <p>{t("intro")} <br /></p>
        <p>
            {t("context")}
            <br /><br />
            {t("eco")} 
            <br />

            <br />
            {t("goal")}

        </p>
        </div>
    );
};

export default APropos;