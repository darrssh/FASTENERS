import { useEffect, useState } from 'react';
import { Input, Textarea } from '../components/ui/Input';
import { brand, contactHref } from '../data/brand';
import { setMeta } from '../lib/utils';

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMeta('Contact (Demo) | Fasteners', 'Contact form demo with editable business details.');
  }, []);

  const email = contactHref('email');
  const phone = contactHref('phone');
  const wa = contactHref('whatsapp');

  return (
    <main className="studio-bg shell grid max-w-5xl gap-10 pb-20 pt-28 md:grid-cols-2">
      <div>
        <p className="eyebrow">Contact · editable</p>
        <h1 className="display-section mt-3">Talk to a <span className="serif-accent brass-text">fastener human.</span></h1>
        <dl className="card mt-6 space-y-3 p-6 text-[14px]">
          <div><dt className="eyebrow">Business email</dt><dd className="mt-1">{email ? <a className="underline" href={email}>{brand.supportEmail}</a> : <span className="text-muted-dim">[not provided — edit src/data/brand.ts]</span>}</dd></div>
          <div><dt className="eyebrow">Phone</dt><dd className="mt-1">{phone ? <a className="underline" href={phone}>{brand.phone}</a> : <span className="text-muted-dim">[not provided]</span>}</dd></div>
          <div><dt className="eyebrow">Address</dt><dd className="mt-1">{brand.address || <span className="text-muted-dim">[not provided]</span>}</dd></div>
          <div><dt className="eyebrow">Business hours</dt><dd className="mt-1">{brand.businessHours || <span className="text-muted-dim">[not provided]</span>}</dd></div>
          <div><dt className="eyebrow">WhatsApp</dt><dd className="mt-1">{wa ? <a className="underline" href={wa}>Chat on WhatsApp</a> : <span className="text-muted-dim">[not configured]</span>}</dd></div>
          <div><dt className="eyebrow">Social</dt><dd className="mt-1 text-muted-dim">[no social links provided]</dd></div>
        </dl>
      </div>
      <div>
        {sent ? (
          <div className="card p-8 text-center" role="status">
            <p className="eyebrow">Message saved · demo</p>
            <h2 className="mt-2 font-display text-2xl font-bold">Thanks, {form.name || 'there'}.</h2>
            <p className="mt-2 text-[14px] text-muted">Demo mode — your message was validated and stored locally, not emailed.</p>
            <button className="btn-ghost mt-5" onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }}>Send another</button>
          </div>
        ) : (
          <form
            className="card grid gap-5 p-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || !form.message.trim()) {
                setError('Please complete name, a valid email, and a message.');
                return;
              }
              setError('');
              setSent(true);
            }}
            noValidate
          >
            <Input label="Name" name="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Email" name="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Textarea label="Message" name="message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            {error && <p role="alert" className="text-[14px] text-red-400">{error}</p>}
            <button type="submit" className="btn-primary">Send message — demo</button>
          </form>
        )}
      </div>
    </main>
  );
}
