import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Mode = 'signin' | 'signup';

function translateAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) {
    return 'E-Mail oder Passwort ist falsch.';
  }
  if (message.includes('Email not confirmed')) {
    return 'Diese E-Mail-Adresse ist noch nicht bestätigt. Bitte prüfe dein Postfach.';
  }
  if (message.includes('User already registered')) {
    return 'Für diese E-Mail-Adresse existiert bereits ein Konto.';
  }
  if (message.includes('Password should be at least')) {
    return 'Das Passwort muss mindestens 6 Zeichen lang sein.';
  }
  return message;
}

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }

    setSubmitting(true);
    if (mode === 'signin') {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) setError(translateAuthError(signInError.message));
    } else {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setError(translateAuthError(signUpError.message));
      } else {
        setConfirmationSent(true);
      }
    }
    setSubmitting(false);
  };

  const handleResend = async () => {
    setSubmitting(true);
    setError(null);
    const { error: resendError } = await supabase.auth.resend({ type: 'signup', email });
    if (resendError) setError(translateAuthError(resendError.message));
    setSubmitting(false);
  };

  if (confirmationSent) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <h1>Fast geschafft</h1>
          <p>
            Wir haben eine Bestätigungs-E-Mail an <strong>{email}</strong> geschickt. Klicke auf
            den Link darin, um dein Konto zu aktivieren – danach kannst du dich anmelden.
          </p>
          {error && <p className="form-error">{error}</p>}
          <div className="form-actions">
            <button type="button" className="primary" onClick={handleResend} disabled={submitting}>
              E-Mail erneut senden
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmationSent(false);
                setMode('signin');
              }}
            >
              Zurück zur Anmeldung
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Haushaltsrechner</h1>
        <p className="auth-subtitle">
          {mode === 'signin' ? 'Melde dich mit deinem Konto an.' : 'Erstelle ein neues Konto.'}
        </p>

        <label>
          E-Mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label>
          Passwort
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            minLength={6}
            required
          />
        </label>

        {mode === 'signup' && (
          <label>
            Passwort bestätigen
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>
        )}

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="primary" disabled={submitting}>
            {mode === 'signin' ? 'Anmelden' : 'Registrieren'}
          </button>
        </div>

        <button
          type="button"
          className="auth-switch"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            setError(null);
          }}
        >
          {mode === 'signin'
            ? 'Noch kein Konto? Jetzt registrieren'
            : 'Bereits ein Konto? Jetzt anmelden'}
        </button>
      </form>
    </div>
  );
}
