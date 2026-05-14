import { useForm } from "react-hook-form";

export default function BookingForm({
  authenticated,
  selectedRoomId,
  submitting,
  onCreateBooking,
  onRequireAuth,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: "",
      startTime: "",
      endTime: "",
    },
  });

  const onSubmit = async (values) => {
    if (!authenticated) {
      onRequireAuth();
      return;
    }

    const startTime = new Date(values.startTime);
    const endTime = new Date(values.endTime);
    const isInvalidTimeRange = startTime >= endTime;

    if (isInvalidTimeRange) {
      setError("endTime", {
        type: "validate",
        message: "Thời gian kết thúc phải sau thời gian bắt đầu",
      });
      return;
    }

    const result = await onCreateBooking(values);
    if (result.ok) {
      reset();
    }
  };

  return (
    <section className="section-block">
      <h3>Tạo đặt phòng</h3>

      <form className="booking-form" onSubmit={handleSubmit(onSubmit)}>
        <label>
          Họ và tên
          <input
            type="text"
            placeholder="Họ và tên"
            {...register("userName", {
              required: "Họ và tên là bắt buộc",
              maxLength: {
                value: 255,
                message: "Họ và tên không thể vượt quá 255 ký tự",
              },
            })}
          />
          {errors.userName ? (
            <span className="field-error">{errors.userName.message}</span>
          ) : null}
        </label>

        <label>
          Thời gian bắt đầu
          <input
            type="datetime-local"
            {...register("startTime", {
              required: "Thời gian bắt đầu là bắt buộc",
            })}
          />
          {errors.startTime ? (
            <span className="field-error">{errors.startTime.message}</span>
          ) : null}
        </label>

        <label>
          Thời gian kết thúc
          <input
            type="datetime-local"
            {...register("endTime", {
              required: "Thời gian kết thúc là bắt buộc",
            })}
          />
          {errors.endTime ? (
            <span className="field-error">{errors.endTime.message}</span>
          ) : null}
        </label>

        {authenticated ? (
          <button
            type="submit"
            className="submit-btn"
            disabled={!selectedRoomId || submitting}
          >
            {submitting ? "Lưu đặt phòng..." : "Tạo đặt phòng"}
          </button>
        ) : (
          <button type="button" className="submit-btn" onClick={onRequireAuth}>
            Đăng nhập để đặt phòng
          </button>
        )}
      </form>
    </section>
  );
}
