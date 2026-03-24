import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Drawer,
  Form,
  Image,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  message
} from "antd";
import { adminApi } from "../api/adminApi";
import { ImageUploadField } from "../components/common/ImageUploadField";
import { PageHeaderCard } from "../components/common/PageHeaderCard";
import { RichTextEditor } from "../components/common/RichTextEditor";
import { StatusTag } from "../components/common/StatusTag";
import { applyServerValidationToForm, createMinLengthRule, getApiErrorMessage } from "../utils/formFeedback";
import { parseDimensionOptions, serializeDimensionOptions } from "../utils/productDimensions";

const mapImages = (images = []) =>
  images.map((image, index) => ({
    url: image.url,
    key: image.key,
    altText: image.altText || "",
    sortOrder: image.sortOrder ?? index,
    isPrimary: Boolean(image.isPrimary)
  }));

export function ProductsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const productsQuery = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => adminApi.getProducts({ limit: 100 })
  });

  const categoriesQuery = useQuery({
    queryKey: ["admin-product-categories"],
    queryFn: () => adminApi.getCategories({ type: "PRODUCT", limit: 100 })
  });

  const saveMutation = useMutation({
    mutationFn: async (values) => {
      const payload = {
        ...values,
        tags: values.tags ? values.tags.split(",").map((item) => item.trim()).filter(Boolean) : [],
        images: mapImages(values.images),
        dimensions: serializeDimensionOptions(values.dimensions)
      };
      delete payload.slug;

      if (editing) {
        return adminApi.updateProduct(editing.id, payload);
      }
      return adminApi.createProduct(payload);
    },
    onSuccess: () => {
      message.success("Đã lưu sản phẩm.");
      setOpen(false);
      setEditing(null);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error) => {
      const hasFieldErrors = applyServerValidationToForm(form, error);

      message.error(
        hasFieldErrors ? "Vui lòng kiểm tra lại các ô đang báo lỗi trước khi lưu." : getApiErrorMessage(error, "Không thể lưu sản phẩm.")
      );
    }
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteProduct,
    onSuccess: () => {
      message.success("Đã xóa sản phẩm.");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    }
  });

  const openEdit = (record) => {
    setEditing(record);
    setOpen(true);
    form.setFieldsValue({
      ...record,
      tags: (record.tags || []).join(", "),
      images: mapImages(record.images || []),
      dimensions: parseDimensionOptions(record.dimensions)
    });
  };

  const columns = [
    {
      title: "Ảnh",
      render: (_, record) => (
        <Image
          src={record.thumbnail || record.images?.[0]?.url}
          width={92}
          height={72}
          style={{ objectFit: "cover", borderRadius: 12 }}
        />
      )
    },
    { title: "Tên sản phẩm", dataIndex: "name" },
    { title: "Danh mục", render: (_, record) => record.category?.name },
    { title: "Nổi bật", dataIndex: "isFeatured", render: (value) => <StatusTag value={value} /> },
    { title: "Trạng thái", dataIndex: "isVisible", render: (value) => <StatusTag value={value} /> },
    {
      title: "Tác vụ",
      render: (_, record) => (
        <Space>
          <Button onClick={() => openEdit(record)}>Sửa</Button>
          <Popconfirm title="Xóa sản phẩm này?" okText="Xóa" cancelText="Hủy" onConfirm={() => deleteMutation.mutate(record.id)}>
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <PageHeaderCard
        title="Quản lý sản phẩm"
        description="Quản lý tên sản phẩm, hình ảnh, kích thước, trạng thái hiển thị và sắp xếp thứ tự. Liên kết của sản phẩm sẽ tự tạo theo tên."
        actions={
          <Button
            type="primary"
            onClick={() => {
              setEditing(null);
              setOpen(true);
              form.setFieldsValue({
                sortOrder: 0,
                isFeatured: false,
                isVisible: true,
                images: []
              });
            }}
          >
            Thêm sản phẩm
          </Button>
        }
      />

      <Table className="admin-card" rowKey="id" dataSource={productsQuery.data?.items || []} columns={columns} />

      <Drawer
        open={open}
        width={880}
        title={editing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        onClose={() => setOpen(false)}
        extra={
          <Button type="primary" onClick={() => form.submit()} loading={saveMutation.isPending}>
            Lưu
          </Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={(values) => saveMutation.mutate(values)}>
          <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true, message: "Vui lòng chọn danh mục." }]}>
            <Select
              options={(categoriesQuery.data?.items || []).map((item) => ({
                label: item.name,
                value: item.id
              }))}
            />
          </Form.Item>
          <Form.Item name="name" label="Tên sản phẩm" rules={[createMinLengthRule("Tên sản phẩm", 2)]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="shortDescription"
            label="Mô tả ngắn"
            rules={[createMinLengthRule("Mô tả ngắn", 10)]}
            extra="Nên viết ít nhất 10 ký tự để khách hàng hiểu nhanh về sản phẩm."
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="content" label="Mô tả chi tiết">
            <RichTextEditor />
          </Form.Item>
          <Space style={{ display: "flex" }} size={16} align="start">
            <Form.Item name="material" label="Chất liệu" style={{ flex: 1 }}>
              <Input />
            </Form.Item>
            <Form.Item
              name="dimensions"
              label="Các kích thước"
              style={{ flex: 1 }}
              extra="Bạn có thể thêm nhiều lựa chọn kích thước. Ví dụ: Cao 60cm, Cao 90cm, Cao 120cm."
            >
              <Select mode="tags" tokenSeparators={[","]} placeholder="Nhập từng kích thước rồi nhấn Enter" />
            </Form.Item>
          </Space>
          <Form.Item name="tags" label="Tags">
            <Input placeholder="phù điêu, tân cổ điển, ngoại thất" />
          </Form.Item>
          <Form.Item
            name="images"
            label="Bộ ảnh sản phẩm"
            extra="Bạn có thể chọn nhiều ảnh để khách xem rõ sản phẩm từ nhiều góc khác nhau."
          >
            <ImageUploadField folder="products" multiple />
          </Form.Item>
          <Space style={{ display: "flex" }} size={16} align="start">
            <Form.Item name="sortOrder" label="Thứ tự">
              <InputNumber min={0} style={{ width: 120 }} />
            </Form.Item>
            <Form.Item name="isFeatured" label="Nổi bật" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="isVisible" label="Đang hiển thị" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Space>
          <Form.Item
            name="metaTitle"
            label="Tiêu đề khi tìm kiếm (tùy chọn)"
            extra="Nếu muốn, bạn có thể đặt một tiêu đề riêng khi sản phẩm xuất hiện trên Google."
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="metaDescription"
            label="Mô tả khi tìm kiếm (tùy chọn)"
            extra="Nếu để trống, website sẽ tự dùng phần mô tả ngắn của sản phẩm."
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
