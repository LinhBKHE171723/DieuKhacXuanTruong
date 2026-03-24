import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { publicApi } from "../api/publicApi";
import { PageHero } from "../components/common/PageHero";
import { Seo } from "../components/common/Seo";
import { useSiteSettings } from "../hooks/useSiteData";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  subject: "",
  message: ""
};

export function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const settingsQuery = useSiteSettings();
  const settings = settingsQuery.data || {};
  const hotline = settings.hotline || "0909 888 668";
  const email = settings.email || "hello@dieu-khac.vn";
  const address = settings.address || "TP. Hồ Chí Minh";
  const zaloUrl = settings.zaloUrl || "";

  const mutation = useMutation({
    mutationFn: publicApi.createContact,
    onSuccess: () => {
      setMessage("Yêu cầu đã được gửi. Chúng tôi sẽ liên hệ sớm.");
      setForm(initialForm);
    },
    onError: () => {
      setMessage("Không thể gửi liên hệ lúc này. Vui lòng thử lại.");
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");
    mutation.mutate(form);
  };

  return (
    <>
      <Seo
        title="Liên hệ tư vấn"
        description="Gửi thông tin liên hệ để nhận tư vấn sản phẩm, công trình và giải pháp thi công phù hợp."
      />
      <PageHero
        eyebrow="Liên hệ"
        title="Liên hệ tư vấn và báo giá"
        description="Gửi yêu cầu để nhận tư vấn nhanh cho hạng mục của bạn."
        imageUrl="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section">
        <div className="container contact-grid">
          <div className="info-panel">
            <span className="section-title__eyebrow">Thông tin</span>
            <h2>Kết nối với xưởng điêu khắc</h2>
            <p>Bạn có thể gửi mô tả công trình, hình ảnh tham khảo hoặc danh sách hạng mục cần thực hiện để được phân tích nhanh.</p>
            <div className="footer-links">
              <a href={`tel:${hotline}`}>Hotline: {hotline}</a>
              <a href={`mailto:${email}`}>Email: {email}</a>
              <span>Địa chỉ: {address}</span>
              {zaloUrl ? (
                <a href={zaloUrl} target="_blank" rel="noreferrer">
                  Zalo tư vấn
                </a>
              ) : null}
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Họ và tên"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
            <input
              type="text"
              placeholder="Chủ đề"
              value={form.subject}
              onChange={(event) => setForm({ ...form, subject: event.target.value })}
            />
            <textarea
              rows="6"
              placeholder="Mô tả ngắn gọn hạng mục cần tư vấn"
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              required
            />
            <button className="button button--primary" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
            {message ? <p className="form-message">{message}</p> : null}
          </form>
        </div>
      </section>
    </>
  );
}
