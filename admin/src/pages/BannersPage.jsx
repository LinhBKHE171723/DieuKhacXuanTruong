import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Badge,
  Button,
  Drawer,
  Empty,
  Form,
  Input,
  Popconfirm,
  Space,
  Switch,
  Tag,
  Typography,
  message
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  HolderOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { adminApi } from "../api/adminApi";
import { ImageUploadField } from "../components/common/ImageUploadField";
import { PageHeaderCard } from "../components/common/PageHeaderCard";

const { Text } = Typography;

const bannerActions = ["Xem sản phẩm", "Giới thiệu", "Xem công trình", "Liên hệ"];

const normalizeBannerPayload = (values) => ({
  imageUrl: values.image?.url || values.imageUrl || "",
  imageKey: values.image?.key || values.imageKey || null,
  sortOrder: Number.isFinite(Number(values.sortOrder)) ? Number(values.sortOrder) : 0,
  isActive: Boolean(values.isActive),
  isFeatured: false
});

function BannerLivePreview({ values }) {
  const imageUrl = values?.image?.url || values?.imageUrl;

  return (
    <div className="banner-preview-shell">
      <div className="banner-preview">
        <div className="banner-preview__image">
          {imageUrl ? (
            <img src={imageUrl} alt="Banner trang chu" loading="lazy" />
          ) : (
            <div className="banner-preview__placeholder">
              <span>Xem trước banner</span>
              <p>Banner chỉ hiển thị ảnh nền. Bốn nút điều hướng nằm ngay dưới banner.</p>
            </div>
          )}
        </div>
        <div className="banner-preview__wash" />
      </div>

      <div className="banner-preview__action-bar">
        {bannerActions.map((action) => (
          <button key={action} type="button" className="banner-preview__action-button">
            {action}
          </button>
        ))}
      </div>
      <p className="banner-preview__note">
        Đây là cách banner sẽ hiển thị trên trang chủ: ảnh ở trên và 4 nút ở phía dưới.
      </p>
    </div>
  );
}

function SortableBannerCard({ banner, onEdit, onDelete, onQuickUpdate }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: banner.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`banner-admin-card ${isDragging ? "is-dragging" : ""}`}
    >
      <div className="banner-admin-card__image">
        <img src={banner.imageUrl} alt="Banner trang chu" loading="lazy" />
        <div className="banner-admin-card__overlay" />
        <div className="banner-admin-card__floating">
          <Tag color="gold">Thứ tự #{banner.sortOrder + 1}</Tag>
          {banner.isActive ? (
            <Tag color="success">Đang hiển thị</Tag>
          ) : (
            <Tag color="default">Đang ẩn</Tag>
          )}
        </div>
      </div>

      <div className="banner-admin-card__body">
        <div className="banner-admin-card__top">
          <div>
            <Text type="secondary">Banner trang chủ</Text>
            <h3>Ảnh nền + 4 nút cố định</h3>
            <Text type="secondary">
              Website chỉ hiển thị 4 nút: Xem sản phẩm, Giới thiệu, Xem công trình và Liên hệ.
            </Text>
          </div>
          <button className="banner-admin-card__drag" type="button" {...attributes} {...listeners}>
            <HolderOutlined />
          </button>
        </div>

        <div className="banner-admin-card__meta">
          <div>
            <Text strong>Trạng thái</Text>
            <span>{banner.isActive ? "Banner đang hiển thị ngoài trang chủ." : "Banner đang tạm ẩn, khách hàng sẽ không thấy."}</span>
          </div>
          <div>
            <Text strong>Yêu cầu ảnh</Text>
            <span>Hãy chọn ảnh ngang rõ nét để banner hiển thị đẹp và cân đối trên website.</span>
          </div>
        </div>

        <div className="banner-admin-card__switches">
          <label>
            <span>Hiển thị ngoài trang chủ</span>
            <Switch
              checked={banner.isActive}
              checkedChildren={<EyeOutlined />}
              unCheckedChildren={<EyeInvisibleOutlined />}
              onChange={(checked) => onQuickUpdate(banner, { isActive: checked })}
            />
          </label>
        </div>

        <div className="banner-admin-card__actions">
          <Button icon={<EditOutlined />} onClick={() => onEdit(banner)}>
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Xóa banner này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => onDelete(banner.id)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      </div>
    </article>
  );
}

export function BannersPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [items, setItems] = useState([]);
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const bannersQuery = useQuery({
    queryKey: ["admin-banners"],
    queryFn: () => adminApi.getBanners({ limit: 100 })
  });

  useEffect(() => {
    setItems(bannersQuery.data?.items || []);
  }, [bannersQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async (values) => {
      const payload = normalizeBannerPayload(values);
      if (editing) {
        return adminApi.updateBanner(editing.id, payload);
      }
      return adminApi.createBanner(payload);
    },
    onSuccess: () => {
      message.success(editing ? "Đã cập nhật banner." : "Đã tạo banner mới.");
      setOpen(false);
      setEditing(null);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteBanner,
    onSuccess: () => {
      message.success("Đã xóa banner.");
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
    }
  });

  const reorderMutation = useMutation({
    mutationFn: adminApi.reorderBanners,
    onSuccess: () => {
      message.success("Đã cập nhật thứ tự banner.");
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
    },
    onError: () => {
      message.error("Không thể cập nhật thứ tự banner.");
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
    }
  });

  const quickUpdateMutation = useMutation({
    mutationFn: ({ id, payload }) => adminApi.updateBanner(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
    },
    onError: () => {
      message.error("Không thể cập nhật trạng thái banner.");
    }
  });

  const initialValues = useMemo(
    () => ({
      sortOrder: items.length,
      isActive: true,
      image: null
    }),
    [items.length]
  );

  const openCreate = () => {
    setEditing(null);
    form.setFieldsValue(initialValues);
    setOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      image: record.imageUrl
        ? {
            url: record.imageUrl,
            key: record.imageKey,
            altText: "Banner trang chu"
          }
        : null
    });
    setOpen(true);
  };

  const handleQuickUpdate = (banner, patch) => {
    quickUpdateMutation.mutate({
      id: banner.id,
      payload: normalizeBannerPayload({
        ...banner,
        ...patch,
        image: {
          url: banner.imageUrl,
          key: banner.imageKey,
          altText: "Banner trang chu"
        }
      })
    });
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) {
      return;
    }

    setItems((current) => {
      const oldIndex = current.findIndex((item) => item.id === active.id);
      const newIndex = current.findIndex((item) => item.id === over.id);
      const next = arrayMove(current, oldIndex, newIndex).map((item, index) => ({
        ...item,
        sortOrder: index
      }));

      reorderMutation.mutate(next.map((item) => ({ id: item.id, sortOrder: item.sortOrder })));
      return next;
    });
  };

  return (
    <div>
      <PageHeaderCard
        title="Quản lý banner"
        description="Quản lý ảnh banner, trạng thái hiển thị và thứ tự xuất hiện trên trang chủ."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Thêm banner
          </Button>
        }
      />

      <div className="banner-admin-toolbar">
        <Space size={16}>
          <Badge count={items.length} color="#b78b3f" showZero>
            <Text strong>Banner hiện có</Text>
          </Badge>
          <Text type="secondary">
            "Hiển thị" nghĩa là banner xuất hiện ngoài trang chủ. "Ẩn" nghĩa là vẫn lưu trong admin nhưng khách hàng không thấy.
          </Text>
        </Space>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className="banner-admin-list">
            {items.length ? (
              items.map((banner) => (
                <SortableBannerCard
                  key={banner.id}
                  banner={banner}
                  onEdit={openEdit}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  onQuickUpdate={handleQuickUpdate}
                />
              ))
            ) : (
              <div className="admin-card" style={{ padding: 28 }}>
                <Empty description="Chưa có banner nào. Hãy tạo banner đầu tiên cho trang chủ." />
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <Drawer
        open={open}
        width={1040}
        destroyOnClose
        title={editing ? "Chỉnh sửa banner" : "Thêm banner mới"}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        extra={
          <Space>
            <Button
              onClick={() => {
                setOpen(false);
                setEditing(null);
              }}
            >
              Hủy
            </Button>
            <Button type="primary" onClick={() => form.submit()} loading={saveMutation.isPending}>
              Lưu banner
            </Button>
          </Space>
        }
      >
        <div className="banner-admin-editor">
          <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onFinish={(values) => saveMutation.mutate(values)}
          >
            <Form.Item
              name="image"
              label="Ảnh banner"
              extra="Nên chọn ảnh ngang rõ nét để banner lên đẹp trên cả điện thoại và máy tính."
              rules={[{ required: true, message: "Vui lòng tải ảnh banner." }]}
            >
              <ImageUploadField folder="banners" />
            </Form.Item>

            <div className="banner-admin-editor__grid banner-admin-editor__grid--compact">
              <Form.Item name="sortOrder" label="Thứ tự hiển thị" extra="Số nhỏ hơn sẽ lên trước trong slider.">
                <Input type="number" min={0} />
              </Form.Item>
              <Form.Item
                name="isActive"
                label="Hiển thị ngoài trang chủ"
                extra="Bật để khách hàng thấy banner này, tắt để ẩn tạm thời."
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </div>
          </Form>

          <div className="banner-admin-editor__preview">
            <Text strong>Xem trước banner đầu trang</Text>
            <Text type="secondary">
              Hình xem trước bên dưới giúp bạn dễ hình dung cách banner sẽ xuất hiện trên trang chủ.
            </Text>
            <BannerLivePreview values={formValues} />
          </div>
        </div>
      </Drawer>
    </div>
  );
}
