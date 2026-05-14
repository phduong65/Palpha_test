import { useAuth } from "../context/AuthContext";

export default function TopNavigation({ onOpenAuth }) {
  const { user, logout } = useAuth();

  return (
    <nav className="top-navigation">
      <div className="brand-mark">
        <span>Booking</span>
        <small>Quản lý phòng</small>
      </div>

      <div className="nav-actions">
        {user ? (
          <div className="auth-summary">
            <span>{user.name}</span>
            <button type="button" className="text-btn" onClick={logout}>
              Đăng xuất
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="nav-login-btn"
            onClick={() => onOpenAuth("login")}
          >
            Đăng nhập / Đăng ký
          </button>
        )}
      </div>
    </nav>
  );
}
