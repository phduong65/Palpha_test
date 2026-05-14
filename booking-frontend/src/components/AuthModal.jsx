import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({
  mode,
  onModeChange,
  onClose,
  locked = false,
}) {
  const { authLoading, authError, clearAuthError, login, registerUser } =
    useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (values) => {
    const result =
      mode === "login" ? await login(values) : await registerUser(values);

    if (result.ok) {
      reset();
      onClose?.();
    }
  };

  const switchMode = (nextMode) => {
    clearAuthError();
    onModeChange(nextMode);
  };

  return (
    <div
      className="auth-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (!locked && event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <section
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {!locked ? (
          <button
            type="button"
            className="modal-close"
            aria-label="Đóng popup đăng nhập"
            onClick={onClose}
          >
            x
          </button>
        ) : null}

        <div className="auth-modal-head">
          <p className="eyebrow">Quản lý phòng</p>
          <h2 id="auth-modal-title">
            {mode === "login" ? "Đăng nhập" : "Đăng ký"}
          </h2>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => switchMode("login")}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => switchMode("register")}
          >
            Đăng ký
          </button>
        </div>

        {authError ? <div className="error-box">{authError}</div> : null}

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          {mode === "register" ? (
            <label>
              Họ và tên
              <input
                type="text"
                {...register("name", {
                  required: "Họ và tên là bắt buộc",
                })}
              />
              {errors.name ? (
                <span className="field-error">{errors.name.message}</span>
              ) : null}
            </label>
          ) : null}

          <label>
            Email
            <input
              type="email"
              {...register("email", {
                required: "Email là bắt buộc",
              })}
            />
            {errors.email ? (
              <span className="field-error">{errors.email.message}</span>
            ) : null}
          </label>

          <label>
            Mật khẩu
            <input
              type="password"
              {...register("password", {
                required: "Mật khẩu là bắt buộc",
                minLength:
                  mode === "register"
                    ? {
                        value: 8,
                        message: "Mật khẩu phải có ít nhất 8 ký tự",
                      }
                    : undefined,
              })}
            />
            {errors.password ? (
              <span className="field-error">{errors.password.message}</span>
            ) : null}
          </label>

          {mode === "register" ? (
            <label>
              Xác nhận mật khẩu
              <input
                type="password"
                {...register("passwordConfirmation", {
                  required: "Xác nhận mật khẩu là bắt buộc",
                })}
              />
              {errors.passwordConfirmation ? (
                <span className="field-error">
                  {errors.passwordConfirmation.message}
                </span>
              ) : null}
            </label>
          ) : null}

          <button type="submit" className="submit-btn" disabled={authLoading}>
            {authLoading
              ? "Vui lòng chờ..."
              : mode === "login"
                ? "Đăng nhập"
                : "Đăng ký"}
          </button>
        </form>
      </section>
    </div>
  );
}
