import "../styles/pages-info.css";

import { useTranslation } from 'react-i18next';

const FAQ = () => {
  const { t } = useTranslation('faq');
  return (
    <div className="FAQ">
      <h1>{t("title")}</h1>

      <div className="faq-item">
        <h3>{t("question1")}</h3>
        <p>
        {t("answer1")}
        </p>
      </div>

      <div className="faq-item">
        <h3>{t("question2")}</h3>
        <p>
        {t("answer2")}
        </p>
      </div>

      <div className="faq-item">
        <h3>{t("question3")}</h3>
        <p>
        {t("answer3")}
        </p>
      </div>

      <div className="faq-item">
        <h3>{t("question4")}</h3>
        <p>
        {t("answer4")}
        </p>
      </div>

      <div className="faq-item">
        <h3>{t("question5")}</h3>
        <p>
        {t("answer5")}
        </p>
      </div>
      <div className="faq-item">
        <h3>{t("question6")}</h3>
        <p>
        {t("answer6")}
        </p>
      </div>
      <div className="faq-item">
        <h3>{t("question7")}</h3>
        <p>
        {t("answer7")}
        </p>
      </div>
      <div className="faq-item">
        <h3>{t("question8")}</h3>
        <p>
        {t("answer8")}
        </p>
      </div>
      <div className="faq-item">
        <h3>{t("question9")}</h3>
        <p>
        {t("answer9")}
        </p>
      </div>
    </div>
  );
};

export default FAQ;
