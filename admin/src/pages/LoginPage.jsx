import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const normalizeEmail = (value) => (typeof value === "string" ? value.trim().toLowerCase() : value);

export function LoginPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (values) => {
    try {
      await login({
        ...values,
        email: normalizeEmail(values.email)
      });
      sessionStorage.setItem("admin_welcome_name", values.email);
      navigate("/");
    } catch (error) {
      message.error(error.message || "Đăng nhập thất bại.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <span style={{ color: "#8e6a2f", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 12 }}>
          Khu vực quản trị
        </span>
        <h1>Điêu Khắc CMS</h1>
        <p style={{ color: "#7b6b54", marginBottom: 24 }}>
          Quản lý banner, sản phẩm, công trình, trang nội dung và cấu hình website tại một nơi.
        </p>
        <p style={{ color: "#7b6b54", marginBottom: 18 }}>
          Dùng email quản trị và mật khẩu của bạn để đăng nhập.
        </p>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="email"
            label="Email"
            normalize={normalizeEmail}
            rules={[
              { required: true, message: "Vui lòng nhập email." },
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.resolve();
                  }

                  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value));
                  return isValid
                    ? Promise.resolve()
                    : Promise.reject(new Error("Email không hợp lệ."));
                }
              }
            ]}
          >
            <Input placeholder="admin@dieu-khac.vn" autoComplete="username" />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: "Vui lòng nhập mật khẩu." }]}>
            <Input.Password placeholder="Nhập mật khẩu" autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Đăng nhập
          </Button>
        </Form>
      </div>
    </div>
  );
}
