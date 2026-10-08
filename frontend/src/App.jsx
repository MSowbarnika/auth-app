import { useEffect, useState } from "react";
import { clearToken, fetchMe, getToken, login, register, resetPassword, saveToken } from "./api";
import Dashboard from "./Dashboard";

const RULES = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Upper and lower case letters", test: (p) => /[A-Z]/.test(p) && /[a-z]/.test(p) },
  { label: "A number", test: (p) => /\d/.test(p) },
  { label: "A symbol (like @ # !)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];
const LABELS = ["Too short", "Weak", "Okay", "Good", "Strong"];
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const phoneOk = (p) => /^[0-9+\-\s]{10,15}$/.test(p);
const EMPTY = { fullName: "", email: "", phone: "", password: "", confirm: "" };

const TITLES = {
  login: ["Welcome back", "Sign in to continue to your dashboard."],
  register: ["Create your account", "It takes less than a minute."],
  forgot: ["Reset your password", "Enter your email and phone number, then choose a new password."],
};
const BUTTONS = { login: "Sign in", register: "Create account", forgot: "Update password" };

function Field({ label, error, extra, children }) {
  return (
    <div className="group">
      <label className="field">
        {children}
        <span>{label}</span>
        {extra}
      </label>
      {error && <small className="ferr">{error}</small>}
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(EMPTY);
  const [agree, setAgree] = useState(false);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(!!getToken());

  // restore session on page refresh
  useEffect(() => {
    if (!getToken()) return;
    fetchMe().then(setUser).catch(() => clearToken()).finally(() => setChecking(false));
  }, []);

  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const needsNew = isRegister || isForgot;
  const needsPhone = isRegister || isForgot;
  const passed = RULES.filter((r) => r.test(form.password)).length;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const errors = {};
  if (isRegister && !form.fullName.trim()) errors.fullName = "Enter your full name";
  if (!emailOk(form.email)) errors.email = "Enter a valid email address";
  if (needsPhone && !phoneOk(form.phone)) errors.phone = "Enter a valid phone number (10-15 digits)";
  if (mode === "login" && !form.password) errors.password = "Enter your password";
  if (needsNew && form.password.length < 8) errors.password = "Use at least 8 characters";
  if (needsNew && form.confirm !== form.password) errors.confirm = "Passwords do not match";
  const err = (k) => (submitted ? errors[k] : "");

  const switchMode = (m) => {
    setMode(m); setForm(EMPTY); setAgree(false); setError(""); setNotice(""); setSubmitted(false);
  };

  const logout = () => { clearToken(); setUser(null); switchMode("login"); };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");
    setNotice("");
    if (Object.keys(errors).length) return;
    if (isRegister && !agree) return setError("Please accept the terms to continue");
    setBusy(true);
    try {
      if (isForgot) {
        await resetPassword({ email: form.email, phone: form.phone, password: form.password });
        switchMode("login");
        setNotice("Password changed. Please sign in with your new password.");
        return;
      }
      const data = isRegister
        ? await register({ fullName: form.fullName, email: form.email, phone: form.phone, password: form.password })
        : await login({ email: form.email, password: form.password });
      saveToken(data.token);
      setUser(await fetchMe());
    } catch (ex) {
      setError(ex.message);
    } finally {
      setBusy(false);
    }
  };

  if (checking) return <main className="stage"><span className="spin dark" /></main>;
  if (user) return <Dashboard user={user} onLogout={logout} />;

  const [title, sub] = TITLES[mode];

  return (
    <main className="stage">
      <section className="card">
        <aside className="hero">
          <span className="orb o1" /><span className="orb o2" /><span className="orb o3" />
          <div className="float-card">
            <b>Signed in securely</b>
            <small>Passwords are encrypted before they are saved</small>
          </div>
          <div className="hero-copy">
            <h2>Your work,<br />all in one place.</h2>
            <p>Create an account to save projects, sync across devices, and pick up where you left off.</p>
            <ul className="perks">
              <li>Passwords stored securely</li>
              <li>Stay signed in for 24 hours</li>
              <li>Works on phone and desktop</li>
            </ul>
          </div>
        </aside>

        <div className="panel">
          {!isForgot ? (
            <div className="tabs" role="tablist">
              <button role="tab" aria-selected={!isRegister} className={!isRegister ? "on" : ""} onClick={() => switchMode("login")}>Sign in</button>
              <button role="tab" aria-selected={isRegister} className={isRegister ? "on" : ""} onClick={() => switchMode("register")}>Create account</button>
              <span className="slider" style={{ transform: `translateX(${isRegister ? 100 : 0}%)` }} />
            </div>
          ) : (
            <button className="back" onClick={() => switchMode("login")}>← Back to sign in</button>
          )}

          <h1>{title}</h1>
          <p className="sub">{sub}</p>

          <form onSubmit={submit} noValidate>
            {isRegister && (
              <Field label="Full name" error={err("fullName")}>
                <input value={form.fullName} onChange={set("fullName")} placeholder=" " autoComplete="name" />
              </Field>
            )}

            <Field label="Email" error={err("email")}>
              <input type="email" value={form.email} onChange={set("email")} placeholder=" " autoComplete="email" />
            </Field>

            {needsPhone && (
              <Field label="Phone number" error={err("phone")}>
                <input type="tel" value={form.phone} onChange={set("phone")} placeholder=" " autoComplete="tel" />
              </Field>
            )}

            <Field label={isForgot ? "New password" : "Password"} error={err("password")}
              extra={<button type="button" className="eye" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>}>
              <input type={show ? "text" : "password"} value={form.password} onChange={set("password")} placeholder=" "
                autoComplete={needsNew ? "new-password" : "current-password"} />
            </Field>

            {mode === "login" && (
              <button type="button" className="forgot" onClick={() => switchMode("forgot")}>Forgot password?</button>
            )}

            {needsNew && form.password && (
              <div className="strength">
                <div className="meter">
                  <div className="bars">{[1, 2, 3, 4].map((i) => <i key={i} className={i <= passed ? `s${passed}` : ""} />)}</div>
                  <small>{LABELS[passed]}</small>
                </div>
                <ul className="rules">
                  {RULES.map((r) => (
                    <li key={r.label} className={r.test(form.password) ? "ok" : ""}>{r.label}</li>
                  ))}
                </ul>
              </div>
            )}

            {needsNew && (
              <Field label="Confirm password" error={err("confirm")}>
                <input type={show ? "text" : "password"} value={form.confirm} onChange={set("confirm")} placeholder=" " autoComplete="new-password" />
              </Field>
            )}

            {isRegister && (
              <label className="agree">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                <span>I agree to the Terms and Privacy Policy</span>
              </label>
            )}

            {notice && <div className="notice" role="status">{notice}</div>}
            {error && <div className="error" role="alert">{error}</div>}

            <button className="btn" disabled={busy}>
              {busy ? <span className="spin" /> : BUTTONS[mode]}
            </button>
          </form>

          {!isForgot && (
            <p className="swap">
              {isRegister ? "Already have an account?" : "New here?"}{" "}
              <button onClick={() => switchMode(isRegister ? "login" : "register")}>
                {isRegister ? "Sign in" : "Create an account"}
              </button>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}