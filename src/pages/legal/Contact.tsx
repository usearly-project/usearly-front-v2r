import { type FormEvent, useState } from "react";
import UsearlyFooter from "@src/components/layout/UsearlyFooter";
import "./LegalPages.scss";

const CONTACT_SUBJECTS = [
  "Aide sur mon compte",
  "Question sur le produit",
  "Demande de partenariat",
  "Autre demande",
] as const;

export default function Contact() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleStart = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    setStep(2);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    const mailSubject = encodeURIComponent(`Contact Usearly - ${subject}`);
    const mailBody = encodeURIComponent(
      `Email: ${email}\nSujet: ${subject}\n\nMessage:\n${message}`,
    );

    window.location.href = `mailto:alex10pump@gmail.com?subject=${mailSubject}&body=${mailBody}`;
  };

  return (
    <>
      <section className="contact-page">
        <div className="contact-page__inner">
          <div className="contact-page__content">
            <h1>Nous contacter</h1>
            <p className="contact-page__lead">
              Une question ? Besoin d&apos;aide ? Envie de collaborer ?
            </p>

            <div className="contact-page__text">
              <p>Notre équipe est là pour vous accompagner.</p>
              <p>
                Que vous soyez utilisateur et ayez besoin d&apos;aide pour votre
                compte ou l&apos;utilisation du produit, ou marque intéressée
                par un partenariat avec Usearly, n&apos;hésitez pas à nous
                contacter.
              </p>
              <p>Nous vous répondrons dans les plus brefs délais.</p>
            </div>
          </div>

          <div className="contact-page__panel">
            <div className="contact-page__panel-header">
              <h2>Nous contacter</h2>
              <span className="contact-page__required">*Obligatoire</span>
            </div>

            {step === 1 ? (
              <form className="contact-form" onSubmit={handleStart}>
                <input
                  aria-label="Adresse email"
                  autoComplete="email"
                  name="email"
                  type="email"
                  placeholder="Adresse email*"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />

                <button
                  className="contact-form__button contact-form__button--primary"
                  type="submit"
                >
                  Commencer
                </button>
              </form>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <select
                  aria-label="Sujet de la demande"
                  name="subject"
                  required
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                >
                  <option value="" disabled>
                    Quel sujet correspond le mieux à vos besoins ? *
                  </option>
                  {CONTACT_SUBJECTS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <textarea
                  aria-label="Message"
                  name="message"
                  placeholder="Que pouvons nous faire pour vous ?"
                  rows={6}
                  required
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />

                <div className="contact-form__actions">
                  <button
                    className="contact-form__button contact-form__button--secondary"
                    type="button"
                    onClick={() => setStep(1)}
                  >
                    Retour
                  </button>

                  <button
                    className="contact-form__button contact-form__button--primary"
                    type="submit"
                  >
                    Envoyer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
      <UsearlyFooter />
    </>
  );
}
