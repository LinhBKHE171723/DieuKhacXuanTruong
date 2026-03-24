import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Form, Input, Space, Switch, Tabs, message } from "antd";
import { adminApi } from "../api/adminApi";
import { ImageUploadField } from "../components/common/ImageUploadField";
import { PageHeaderCard } from "../components/common/PageHeaderCard";
import { RichTextEditor } from "../components/common/RichTextEditor";

const aboutStoryFallbackImages = [
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80"
];

const stripHtml = (value = "") => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const slugifyText = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const HOME_FIELD_LIMITS = {
  introBadge: 28,
  introTitle: 72,
  introDescription: 170,
  reasonTitle: 64,
  statLabel: 24,
  statValue: 16,
  reasonItemTitle: 42,
  reasonItemDescription: 110,
  ctaTitle: 68,
  ctaDescription: 150,
  buttonText: 24,
  link: 160
};

const maxLengthRule = (max, label) => ({
  max,
  message: `${label} tối đa ${max} ký tự để giao diện hiển thị cân đối hơn.`
});

const deriveLegacyAboutStories = (page = {}) => {
  const sections = page.sections || {};
  const plainContent = stripHtml(page.content || "");

  const stories = [
    {
      tag: "Tổng quan xưởng",
      title: page.title || "Giới thiệu xưởng",
      slug: "tong-quan-xuong",
      summary: sections.vision || plainContent || "Tổng quan về năng lực và định hướng phát triển của xưởng.",
      imageUrl: aboutStoryFallbackImages[0],
      imageKey: "",
      imageAlt: page.title || "Giới thiệu xưởng",
      content: page.content || `<p>${sections.vision || plainContent}</p>`
    },
    {
      tag: "Giá trị cốt lõi",
      title: "Triết lý chế tác và tiêu chuẩn triển khai",
      slug: "triet-ly-che-tac",
      summary:
        sections.mission ||
        "Cách chúng tôi kết hợp tay nghề thủ công, kỹ thuật khuôn đúc và kiểm soát thi công để giữ chất lượng đồng đều.",
      imageUrl: aboutStoryFallbackImages[1],
      imageKey: "",
      imageAlt: "Triết lý chế tác",
      content: `
        <p>${sections.mission || "Chúng tôi ưu tiên độ bền, tỷ lệ chuẩn và cảm giác hoàn thiện của từng chi tiết."}</p>
        ${(sections.values || [])
          .map(
            (item) =>
              `<p><strong>${item.title || ""}</strong> ${item.description || ""}</p>`
          )
          .join("")}
      `
    },
    {
      tag: "Năng lực triển khai",
      title: "Từ ý tưởng đến thi công thực tế",
      slug: "nang-luc-trien-khai",
      summary:
        Array.isArray(sections.capabilities) && sections.capabilities.length
          ? sections.capabilities[0]
          : "Quy trình phối hợp giữa thiết kế, xưởng chế tác và đội thi công giúp công trình hoàn thiện đồng bộ hơn.",
      imageUrl: aboutStoryFallbackImages[2],
      imageKey: "",
      imageAlt: "Năng lực triển khai",
      content: `
        <ul>
          ${(sections.capabilities || [])
            .map((value) => `<li>${value}</li>`)
            .join("")}
        </ul>
      `
    }
  ];

  return stories.filter((story) => stripHtml(story.summary) || stripHtml(story.content));
};

const homeToForm = (page) => ({
  metaTitle: page.metaTitle,
  metaDescription: page.metaDescription,
  isPublished: page.isPublished,
  introBadge: page.sections?.introBadge || "",
  introTitle: page.sections?.introTitle || "",
  introDescription: page.sections?.introDescription || "",
  reasonTitle: page.sections?.reasonTitle || "",
  stats: page.sections?.stats || [],
  reasons: page.sections?.reasons || [],
  ctaTitle: page.sections?.cta?.title || "",
  ctaDescription: page.sections?.cta?.description || "",
  ctaPrimaryText: page.sections?.cta?.primaryText || "",
  ctaPrimaryLink: page.sections?.cta?.primaryLink || "",
  ctaSecondaryText: page.sections?.cta?.secondaryText || "",
  ctaSecondaryLink: page.sections?.cta?.secondaryLink || ""
});

const aboutToForm = (page) => ({
  title: page.title,
  content: page.content,
  metaTitle: page.metaTitle,
  metaDescription: page.metaDescription,
  isPublished: page.isPublished,
  vision: page.sections?.vision || "",
  mission: page.sections?.mission || "",
  capabilities: (page.sections?.capabilities || []).map((value) => ({ value })),
  values: page.sections?.values || [],
  stories: (page.sections?.stories?.length ? page.sections.stories : deriveLegacyAboutStories(page)).map((story) => ({
    title: story.title || "",
    tag: story.tag || "",
    summary: story.summary || "",
    content: story.content || "",
    imageUrl: story.imageUrl || "",
    imageKey: story.imageKey || "",
    imageAlt: story.imageAlt || "",
    image: story.imageUrl
      ? {
          url: story.imageUrl,
          key: story.imageKey || null,
          altText: story.imageAlt || story.title || "Ảnh bài viết"
        }
      : null
  }))
});

const formToHomePayload = (values) => ({
  title: "Trang chủ",
  heroTitle: "",
  heroSubtitle: "",
  content: "",
  metaTitle: values.metaTitle,
  metaDescription: values.metaDescription,
  isPublished: values.isPublished,
  sections: {
    introBadge: values.introBadge,
    introTitle: values.introTitle,
    introDescription: values.introDescription,
    reasonTitle: values.reasonTitle,
    stats: values.stats || [],
    reasons: values.reasons || [],
    cta: {
      title: values.ctaTitle,
      description: values.ctaDescription,
      primaryText: values.ctaPrimaryText,
      primaryLink: values.ctaPrimaryLink,
      secondaryText: values.ctaSecondaryText,
      secondaryLink: values.ctaSecondaryLink
    }
  }
});

const formToAboutPayload = (values) => ({
  title: values.title,
  heroTitle: "",
  heroSubtitle: "",
  content: values.content,
  metaTitle: values.metaTitle,
  metaDescription: values.metaDescription,
  isPublished: values.isPublished,
  sections: {
    vision: values.vision,
    mission: values.mission,
    capabilities: (values.capabilities || []).map((item) => item.value).filter(Boolean),
    values: values.values || [],
    stories: (values.stories || [])
      .map((item) => ({
        title: item.title || "",
        slug: slugifyText(item.title || ""),
        tag: item.tag || "",
        summary: item.summary || "",
        imageUrl: item.image?.url || item.imageUrl || "",
        imageKey: item.image?.key || item.imageKey || "",
        imageAlt: item.image?.altText || item.imageAlt || item.title || "",
        content: item.content || ""
      }))
      .filter((item) => item.title || item.summary || item.content || item.imageUrl)
  }
});

export function PagesPage() {
  const queryClient = useQueryClient();
  const [homeForm] = Form.useForm();
  const [aboutForm] = Form.useForm();

  const pagesQuery = useQuery({
    queryKey: ["admin-pages"],
    queryFn: adminApi.getPages
  });

  useEffect(() => {
    if (!pagesQuery.data?.length) {
      return;
    }

    const home = pagesQuery.data.find((page) => page.slug === "home");
    const about = pagesQuery.data.find((page) => page.slug === "about");

    if (home) {
      homeForm.setFieldsValue(homeToForm(home));
    }
    if (about) {
      aboutForm.setFieldsValue(aboutToForm(about));
    }
  }, [pagesQuery.data, homeForm, aboutForm]);

  const saveMutation = useMutation({
    mutationFn: ({ slug, payload }) => adminApi.updatePage(slug, payload),
    onSuccess: () => {
      message.success("Đã cập nhật nội dung trang.");
      queryClient.invalidateQueries({ queryKey: ["admin-pages"] });
    }
  });

const renderMetaFields = () => (
  <>
      <Form.Item
        name="metaTitle"
        label="Tiêu đề khi tìm kiếm (tùy chọn)"
        extra="Nếu muốn, bạn có thể đặt một tiêu đề riêng khi trang xuất hiện trên Google."
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="metaDescription"
        label="Mô tả khi tìm kiếm (tùy chọn)"
        extra="Nếu để trống, website sẽ tự lấy nội dung phù hợp từ trang."
      >
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="isPublished" label="Đang hiển thị" valuePropName="checked">
        <Switch />
      </Form.Item>
    </>
  );

  return (
    <div>
      <PageHeaderCard
        title="Quản lý trang tĩnh"
        description="Chỉnh sửa nội dung đang hiển thị trên website, kèm ghi chú rõ từng phần sẽ xuất hiện ở đâu."
      />

      <Tabs
        items={[
          {
            key: "home",
            label: "Trang chủ",
            children: (
              <Card className="admin-card">
                <Form form={homeForm} layout="vertical" onFinish={(values) => saveMutation.mutate({ slug: "home", payload: formToHomePayload(values) })}>
                  <Form.Item
                    name="introBadge"
                    label="Nhãn nhỏ phần giới thiệu"
                    extra="Dòng chữ nhỏ nằm ngay dưới banner ở trang chủ."
                    rules={[maxLengthRule(HOME_FIELD_LIMITS.introBadge, "Nhãn nhỏ")]}
                  >
                    <Input maxLength={HOME_FIELD_LIMITS.introBadge} showCount />
                  </Form.Item>
                  <Form.Item
                    name="introTitle"
                    label="Tiêu đề phần giới thiệu"
                    extra="Tiêu đề lớn của phần giới thiệu trên trang chủ."
                    rules={[maxLengthRule(HOME_FIELD_LIMITS.introTitle, "Tiêu đề phần giới thiệu")]}
                  >
                    <Input maxLength={HOME_FIELD_LIMITS.introTitle} showCount />
                  </Form.Item>
                  <Form.Item
                    name="introDescription"
                    label="Mô tả phần giới thiệu"
                    extra="Đoạn giới thiệu ngắn nằm dưới tiêu đề."
                    rules={[maxLengthRule(HOME_FIELD_LIMITS.introDescription, "Mô tả phần giới thiệu")]}
                  >
                    <Input.TextArea rows={4} maxLength={HOME_FIELD_LIMITS.introDescription} showCount />
                  </Form.Item>
                  <Form.Item
                    name="reasonTitle"
                    label="Tiêu đề phần lý do chọn"
                    extra="Tiêu đề của phần lý do khách nên chọn bạn."
                    rules={[maxLengthRule(HOME_FIELD_LIMITS.reasonTitle, "Tiêu đề phần lý do chọn")]}
                  >
                    <Input maxLength={HOME_FIELD_LIMITS.reasonTitle} showCount />
                  </Form.Item>
                  <Form.List name="stats">
                    {(fields, { add, remove }) => (
                      <Card size="small" title="Thông số nhanh" style={{ marginBottom: 16 }}>
                        {fields.map((field) => (
                          <Space key={field.key} align="start" style={{ display: "flex", marginBottom: 12 }}>
                            <Form.Item
                              {...field}
                              name={[field.name, "label"]}
                              label="Nhãn"
                              extra="Ví dụ: Dự án đã hoàn thành"
                              rules={[maxLengthRule(HOME_FIELD_LIMITS.statLabel, "Nhãn thông số")]}
                            >
                              <Input maxLength={HOME_FIELD_LIMITS.statLabel} showCount />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, "value"]}
                              label="Giá trị"
                              extra="Ví dụ: 350+"
                              rules={[maxLengthRule(HOME_FIELD_LIMITS.statValue, "Giá trị thông số")]}
                            >
                              <Input maxLength={HOME_FIELD_LIMITS.statValue} showCount />
                            </Form.Item>
                            <Button danger onClick={() => remove(field.name)}>
                              Xóa
                            </Button>
                          </Space>
                        ))}
                        <Button disabled={fields.length >= 3} onClick={() => add({ label: "", value: "" })}>
                          {fields.length >= 3 ? "Tối đa 3 thông số" : "Thêm thông số"}
                        </Button>
                      </Card>
                    )}
                  </Form.List>
                  <Form.List name="reasons">
                    {(fields, { add, remove }) => (
                      <Card size="small" title="Các thẻ lý do chọn" style={{ marginTop: 16 }}>
                        {fields.map((field) => (
                          <Space key={field.key} align="start" style={{ display: "flex", marginBottom: 12 }}>
                            <Form.Item
                              {...field}
                              name={[field.name, "title"]}
                              label="Tiêu đề"
                              extra="Tiêu đề ngắn của từng lý do"
                              rules={[maxLengthRule(HOME_FIELD_LIMITS.reasonItemTitle, "Tiêu đề lý do chọn")]}
                            >
                              <Input maxLength={HOME_FIELD_LIMITS.reasonItemTitle} showCount />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, "description"]}
                              label="Mô tả"
                              extra="Nội dung ngắn giải thích cho lý do này"
                              rules={[maxLengthRule(HOME_FIELD_LIMITS.reasonItemDescription, "Mô tả lý do chọn")]}
                            >
                              <Input.TextArea rows={2} maxLength={HOME_FIELD_LIMITS.reasonItemDescription} showCount />
                            </Form.Item>
                            <Button danger onClick={() => remove(field.name)}>
                              Xóa
                            </Button>
                          </Space>
                        ))}
                        <Button disabled={fields.length >= 4} onClick={() => add({ title: "", description: "" })}>
                          {fields.length >= 4 ? "Tối đa 4 lý do" : "Thêm lý do"}
                        </Button>
                      </Card>
                    )}
                  </Form.List>
                  <Card size="small" title="Khối kêu gọi hành động cuối trang" style={{ marginTop: 16 }}>
                    <Form.Item
                      name="ctaTitle"
                      label="Tiêu đề CTA"
                      extra="Tiêu đề của phần kêu gọi liên hệ ở cuối trang chủ"
                      rules={[maxLengthRule(HOME_FIELD_LIMITS.ctaTitle, "Tiêu đề CTA")]}
                    >
                      <Input maxLength={HOME_FIELD_LIMITS.ctaTitle} showCount />
                    </Form.Item>
                    <Form.Item
                      name="ctaDescription"
                      label="Mô tả CTA"
                      extra="Đoạn giới thiệu ngắn nằm dưới tiêu đề"
                      rules={[maxLengthRule(HOME_FIELD_LIMITS.ctaDescription, "Mô tả CTA")]}
                    >
                      <Input.TextArea rows={3} maxLength={HOME_FIELD_LIMITS.ctaDescription} showCount />
                    </Form.Item>
                    <Space style={{ display: "flex" }}>
                      <Form.Item
                        name="ctaPrimaryText"
                        label="Nút chính"
                        extra="Nút nổi bật nhất ở cuối trang"
                        rules={[maxLengthRule(HOME_FIELD_LIMITS.buttonText, "Nút chính")]}
                      >
                        <Input maxLength={HOME_FIELD_LIMITS.buttonText} showCount />
                      </Form.Item>
                      <Form.Item
                        name="ctaPrimaryLink"
                        label="Liên kết chính"
                        extra="Ví dụ: /lien-he"
                        rules={[maxLengthRule(HOME_FIELD_LIMITS.link, "Liên kết chính")]}
                      >
                        <Input maxLength={HOME_FIELD_LIMITS.link} showCount />
                      </Form.Item>
                    </Space>
                    <Space style={{ display: "flex" }}>
                      <Form.Item
                        name="ctaSecondaryText"
                        label="Nút phụ"
                        extra="Nút phụ nằm cạnh nút chính"
                        rules={[maxLengthRule(HOME_FIELD_LIMITS.buttonText, "Nút phụ")]}
                      >
                        <Input maxLength={HOME_FIELD_LIMITS.buttonText} showCount />
                      </Form.Item>
                      <Form.Item
                        name="ctaSecondaryLink"
                        label="Liên kết phụ"
                        extra="Ví dụ: /cong-trinh"
                        rules={[maxLengthRule(HOME_FIELD_LIMITS.link, "Liên kết phụ")]}
                      >
                        <Input maxLength={HOME_FIELD_LIMITS.link} showCount />
                      </Form.Item>
                    </Space>
                  </Card>
                  {renderMetaFields()}
                  <Button type="primary" htmlType="submit" loading={saveMutation.isPending}>
                    Lưu trang chủ
                  </Button>
                </Form>
              </Card>
            )
          },
          {
            key: "about",
            label: "Giới thiệu",
            children: (
              <Card className="admin-card">
                <Form
                  form={aboutForm}
                  layout="vertical"
                  className="page-editor-form"
                  onFinish={(values) => saveMutation.mutate({ slug: "about", payload: formToAboutPayload(values) })}
                >
                  <Card size="small" title="1. Phần mở đầu trang giới thiệu" className="page-editor-section" style={{ marginBottom: 16 }}>
                    <p className="page-editor-section__hint">
                      Phần này sẽ hiện đầu tiên trên trang giới thiệu: tiêu đề, đoạn tầm nhìn và phần mở đầu.
                    </p>
                    <Form.Item
                      name="title"
                      label="Tiêu đề trang"
                      extra="Tiêu đề lớn ở đầu trang giới thiệu."
                      rules={[{ required: true, message: "Vui lòng nhập tiêu đề." }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item
                      name="vision"
                      label="Tầm nhìn"
                      extra="Đoạn giới thiệu nổi bật nằm gần đầu trang."
                    >
                      <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item
                      name="content"
                      label="Nội dung mở đầu"
                      extra="Phần nội dung chính mở đầu của trang giới thiệu."
                    >
                      <RichTextEditor />
                    </Form.Item>
                  </Card>

                  <Card size="small" title="2. Cột phải và phần tóm tắt ngắn" className="page-editor-section" style={{ marginBottom: 16 }}>
                    <p className="page-editor-section__hint">
                      Các nội dung dưới đây sẽ hiển thị ở cột thông tin bên phải và các ô tóm tắt ngắn bên dưới.
                    </p>
                    <Form.Item
                      name="mission"
                      label="Sứ mệnh"
                      extra="Nội dung hiển thị trong ô giới thiệu về sứ mệnh."
                    >
                      <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.List name="values">
                      {(fields, { add, remove }) => (
                        <Card size="small" title="Điểm nhấn ngắn" style={{ marginBottom: 16 }}>
                          <p className="page-editor-section__hint">
                            Mỗi mục sẽ hiện thành một ô thông tin ngắn để khách đọc nhanh.
                          </p>
                          {fields.map((field) => (
                            <div key={field.key} className="page-editor-list-row">
                              <div className="page-editor-form__grid page-editor-form__grid--two">
                                <Form.Item
                                  {...field}
                                  name={[field.name, "title"]}
                                  label="Tiêu đề ngắn"
                                  extra="Ví dụ: Chế tác tại xưởng, Hoàn thiện tinh xảo"
                                >
                                  <Input />
                                </Form.Item>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "description"]}
                                  label="Mô tả ngắn"
                                  extra="Đoạn giải thích ngắn nằm dưới tiêu đề."
                                >
                                  <Input.TextArea rows={4} />
                                </Form.Item>
                              </div>
                              <Button danger onClick={() => remove(field.name)}>
                                Xóa điểm nhấn
                              </Button>
                            </div>
                          ))}
                          <Button onClick={() => add({ title: "", description: "" })}>Thêm điểm nhấn</Button>
                        </Card>
                      )}
                    </Form.List>

                    <Form.List name="capabilities">
                      {(fields, { add, remove }) => (
                        <Card size="small" title="Năng lực hiển thị ngắn" style={{ marginBottom: 0 }}>
                          <p className="page-editor-section__hint">
                            Mỗi mục sẽ hiện thành một dòng ngắn ở phần giới thiệu.
                          </p>
                          {fields.map((field) => (
                            <div key={field.key} className="page-editor-list-row">
                              <Form.Item
                                {...field}
                                name={[field.name, "value"]}
                                label="Nội dung năng lực"
                                extra="Ví dụ: Tư vấn bố cục, dựng mẫu, thi công hoàn thiện"
                              >
                                <Input.TextArea rows={3} />
                              </Form.Item>
                              <Button danger onClick={() => remove(field.name)}>
                                Xóa năng lực
                              </Button>
                            </div>
                          ))}
                          <Button onClick={() => add({ value: "" })}>Thêm năng lực</Button>
                        </Card>
                      )}
                    </Form.List>
                  </Card>

                  <Form.List name="stories">
                    {(fields, { add, remove }) => (
                      <Card size="small" title="3. Danh sách bài viết giới thiệu" className="page-editor-section" style={{ marginBottom: 16 }}>
                        <p className="page-editor-section__hint">
                          Mỗi bài viết gồm nhãn nhỏ, tiêu đề, đoạn giới thiệu, ảnh và nội dung chi tiết. Liên kết bài viết sẽ tự tạo theo tiêu đề.
                        </p>
                        {fields.map((field, index) => (
                          <Card
                            key={field.key}
                            size="small"
                            title={`Bài viết ${index + 1}`}
                            className="page-editor-story-card"
                            style={{ marginBottom: 16 }}
                            extra={
                              <Button danger onClick={() => remove(field.name)}>
                                Xóa bài viết
                              </Button>
                            }
                          >
                            <Form.Item
                              {...field}
                              name={[field.name, "tag"]}
                              label="Nhãn nhỏ"
                              extra="Dòng chữ nhỏ xuất hiện trên thẻ bài viết và đầu bài chi tiết."
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, "title"]}
                              label="Tiêu đề bài viết"
                              extra="Tiêu đề chính của bài viết."
                              rules={[{ required: true, message: "Vui lòng nhập tiêu đề bài viết." }]}
                            >
                              <Input size="large" />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, "summary"]}
                              label="Sapo ngắn"
                              extra="Đoạn giới thiệu ngắn giúp khách hiểu nhanh nội dung bài viết."
                            >
                              <Input.TextArea rows={4} />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, "image"]}
                              label="Ảnh bài viết"
                              extra="Ảnh đại diện của bài viết."
                            >
                              <ImageUploadField folder="pages" />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, "content"]}
                              label="Nội dung chi tiết bài viết"
                              extra="Phần nội dung đầy đủ khi khách bấm vào xem chi tiết."
                            >
                              <RichTextEditor />
                            </Form.Item>
                          </Card>
                        ))}
                        <Button
                          onClick={() =>
                            add({
                              tag: "",
                              title: "",
                              summary: "",
                              image: null,
                              content: ""
                            })
                          }
                        >
                          Thêm bài viết
                        </Button>
                      </Card>
                    )}
                  </Form.List>
                  {renderMetaFields()}
                  <Button type="primary" htmlType="submit" loading={saveMutation.isPending}>
                    Lưu trang giới thiệu
                  </Button>
                </Form>
              </Card>
            )
          }
        ]}
      />
    </div>
  );
}
