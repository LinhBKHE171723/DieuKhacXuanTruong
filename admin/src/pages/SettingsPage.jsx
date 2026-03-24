import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Form, Input, message } from "antd";
import { adminApi } from "../api/adminApi";
import { ImageUploadField } from "../components/common/ImageUploadField";
import { PageHeaderCard } from "../components/common/PageHeaderCard";

export function SettingsPage() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const settingsQuery = useQuery({
    queryKey: ["admin-settings"],
    queryFn: adminApi.getSettings
  });

  useEffect(() => {
    if (!settingsQuery.data) {
      return;
    }

    form.setFieldsValue({
      ...settingsQuery.data,
      logo: settingsQuery.data.logoUrl
        ? { url: settingsQuery.data.logoUrl, altText: settingsQuery.data.companyName || "logo" }
        : null,
      favicon: settingsQuery.data.faviconUrl
        ? { url: settingsQuery.data.faviconUrl, altText: settingsQuery.data.companyName || "favicon" }
        : null
    });
  }, [settingsQuery.data, form]);

  const saveMutation = useMutation({
    mutationFn: async (values) => {
      const payload = {
        ...values,
        logoUrl: values.logo?.url || "",
        faviconUrl: values.favicon?.url || ""
      };
      delete payload.logo;
      delete payload.favicon;
      return adminApi.updateSettings(payload);
    },
    onSuccess: () => {
      message.success("Đã cập nhật cấu hình.");
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    }
  });

  return (
    <div>
      <PageHeaderCard
        title="Cấu hình hệ thống"
        description="Quản lý thông tin công ty, logo, favicon, mạng xã hội và phần thông tin hiển thị khi website xuất hiện trên công cụ tìm kiếm."
      />
      <Card className="admin-card">
        <Form form={form} layout="vertical" onFinish={(values) => saveMutation.mutate(values)}>
          <Form.Item name="siteName" label="Tên website">
            <Input />
          </Form.Item>
          <Form.Item name="companyName" label="Tên công ty">
            <Input />
          </Form.Item>
          <Form.Item name="tagline" label="Khẩu hiệu">
            <Input />
          </Form.Item>
          <Form.Item name="hotline" label="Hotline">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="logo" label="Logo">
            <ImageUploadField folder="settings" />
          </Form.Item>
          <Form.Item name="favicon" label="Favicon">
            <ImageUploadField folder="settings" />
          </Form.Item>
          <Form.Item name="zaloUrl" label="Zalo">
            <Input />
          </Form.Item>
          <Form.Item name="messengerUrl" label="Messenger">
            <Input />
          </Form.Item>
          <Form.Item name="facebookUrl" label="Facebook">
            <Input />
          </Form.Item>
          <Form.Item name="youtubeUrl" label="Youtube">
            <Input />
          </Form.Item>
          <Form.Item
            name="metaTitle"
            label="Tiêu đề khi tìm kiếm (tùy chọn)"
            extra="Đây là tiêu đề có thể xuất hiện khi website được tìm thấy trên Google."
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="metaDescription"
            label="Mô tả khi tìm kiếm (tùy chọn)"
            extra="Đây là đoạn giới thiệu ngắn về website khi khách nhìn thấy trên Google hoặc khi chia sẻ link."
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={saveMutation.isPending}>
            Lưu cấu hình
          </Button>
        </Form>
      </Card>
    </div>
  );
}
