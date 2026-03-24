import { Reveal } from "../common/Reveal";
import { SectionTitle } from "../common/SectionTitle";

export function Testimonials({ testimonials = [] }) {
  return (
    <section className="section">
      <div className="container">
        <SectionTitle eyebrow="Phản hồi" title="Nhận xét từ khách hàng và đơn vị đầu tư" />
        <div className="testimonial-grid">
          {testimonials.map((item, index) => (
            <Reveal key={`${item.name}-${index}`} delay={index * 0.08}>
              <blockquote className="testimonial-card">
                <p>{item.content}</p>
                <footer>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
