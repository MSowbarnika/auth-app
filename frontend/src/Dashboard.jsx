export default function Dashboard({ user, onLogout }) {
  const initials = user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const joined = new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  return (
    <main className="dash">
      <header className="dash-bar">
        <strong>Welcome</strong>
        <button className="ghost" onClick={onLogout}>Sign out</button>
      </header>

      <section className="dash-body">
        <div className="profile">
          <div className="avatar">{initials}</div>
          <h1>Hi, {user.fullName.split(" ")[0]}</h1>
          <p>You're signed in. Your session is saved on this device.</p>
        </div>

        <div className="info">
          <div><small>Full name</small><b>{user.fullName}</b></div>
          <div><small>Email</small><b>{user.email}</b></div>
          <div><small>Phone</small><b>{user.phone || "Not added"}</b></div>
          <div><small>Member since</small><b>{joined}</b></div>
          <div><small>Account ID</small><b>#{user.id}</b></div>
        </div>
      </section>
    </main>
  );
}