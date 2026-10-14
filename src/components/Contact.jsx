import { useRef, useState } from 'react'
import { contactChannels, engagements, profile, workSteps } from '../data/profile.js'
import { useLocale } from '../i18n/LocaleContext.jsx'
import './Contact.css'

export default function Contact() {
  const t = useLocale()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const nameRef = useRef(null)

  // Picking a way to work together starts the message for the visitor and
  // takes them to the form, so the card leads somewhere rather than only
  // describing it. Whatever they had already typed is kept, after the opener.
  const startWith = (id) => {
    const opener = t.contact.work.engagements[id].message
    setMessage((current) => (current.startsWith('Hi Joney') || !current ? opener : `${opener}${current}`))
    const field = nameRef.current
    field?.closest('.contact-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    // After the scroll has begun, so the focus does not jump the page there.
    setTimeout(() => field?.focus({ preventScroll: true }), 450)
  }

  // This is a static build with no server to post to, so the form hands the
  // finished message to the visitor's own mail client rather than pretending to
  // send it. The address is printed beside the form as well, because a browser
  // with no mail handler registered will do nothing at all with a mailto:.
  const submit = (event) => {
    event.preventDefault()
    const subject = `${t.contact.form.subject} — ${name}`
    const body = `${message}\n\n— ${name}\n${email}`
    window.location.href = `mailto:${profile.contactEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <section className="section" id="contact">
      <div className="shell">
        <div className="work-with">
          <div className="work-with-head">
            <span className="eyebrow">{t.contact.work.eyebrow}</span>
            <h2>{t.contact.work.heading}</h2>
            <p>{t.contact.work.body}</p>
            <p className="work-with-status">
              <span className="dot" aria-hidden="true" />
              {t.contact.work.available}
              <span className="work-with-where">{t.contact.work.where}</span>
            </p>
          </div>

          <ul className="work-options">
            {engagements.map((id, index) => {
              const option = t.contact.work.engagements[id]
              return (
                <li key={id} className="card work-option" data-tilt="soft" data-reveal style={{ '--reveal-delay': `${index * 90}ms` }}>
                  <span className="work-option-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{option.title}</h3>
                  <p>{option.body}</p>
                  <ul>
                    {option.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <button type="button" className="btn btn-ghost work-option-cta" data-press onClick={() => startWith(id)}>
                    {t.contact.work.cta}
                    <span aria-hidden="true">→</span>
                  </button>
                </li>
              )
            })}
          </ul>

          <h3 className="work-steps-title">{t.contact.work.stepsTitle}</h3>
          <ol className="work-steps">
            {workSteps.map((id, index) => (
              <li key={id}>
                <span className="work-step-number" aria-hidden="true">{index + 1}</span>
                <strong>{t.contact.work.steps[id].title}</strong>
                <span>{t.contact.work.steps[id].body}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="card contact-panel" data-reveal>
          <div className="contact-copy">
            <span className="eyebrow">{t.contact.eyebrow}</span>
            <h2>{t.contact.heading}</h2>
            <p>{t.contact.body}</p>
            {/* Printed in full, and not only linked: a browser with no mail
                app does nothing with a mailto:, and the same goes for a
                desktop without Telegram or WhatsApp installed. */}
            <h3 className="contact-direct-title">{t.contact.form.directTitle}</h3>
            <ul className="contact-channels">
              {contactChannels.map((channel) => (
                <li key={channel.id}>
                  <span className="channel-label">{t.contact.channels[channel.id]}</span>
                  <a
                    className="channel-value"
                    href={channel.href}
                    {...(channel.id === 'email'
                      ? {}
                      : { target: '_blank', rel: 'noreferrer noopener' })}
                  >
                    {channel.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form className="contact-form" onSubmit={submit}>
            <label className="field">
              <span>{t.contact.form.name}</span>
              <input
                ref={nameRef}
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </label>

            <label className="field">
              <span>{t.contact.form.email}</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className="field">
              <span>{t.contact.form.message}</span>
              <textarea
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
              />
            </label>

            <button type="submit" className="btn btn-primary contact-send" data-press>
              {t.contact.form.send}
            </button>
            <p className="contact-note">{t.contact.form.note}</p>
          </form>
        </div>
      </div>
    </section>
  )
}
