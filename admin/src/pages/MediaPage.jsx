import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Empty, Image, Popconfirm, Space, Upload, message } from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { adminApi } from "../api/adminApi";
import { PageHeaderCard } from "../components/common/PageHeaderCard";

const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

export function MediaPage() {
  const queryClient = useQueryClient();

  const mediaQuery = useQuery({
    queryKey: ["admin-media"],
    queryFn: () => adminApi.getMedia({ limit: 100 })
  });

  const uploadProps = {
    multiple: true,
    showUploadList: false,
    accept: "image/jpeg,image/png,image/webp,image/gif,image/svg+xml",
    beforeUpload: (file) => {
      if (!acceptedImageTypes.includes(file.type)) {
        message.error("Chỉ chấp nhận file ảnh JPG, PNG, WEBP, GIF hoặc SVG.");
        return Upload.LIST_IGNORE;
      }

      if (file.size > 10 * 1024 * 1024) {
        message.error("Dung lượng ảnh tối đa là 10MB.");
        return Upload.LIST_IGNORE;
      }

      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        await adminApi.uploadMedia({ files: [file], folder: "library" });
        queryClient.invalidateQueries({ queryKey: ["admin-media"] });
        message.success("Đã tải ảnh lên thư viện.");
        onSuccess?.("ok");
      } catch (error) {
        message.error(error.message || "Tải ảnh thất bại.");
        onError?.(error);
      }
    }
  };

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteMedia,
    onSuccess: () => {
      message.success("Đã xóa media.");
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
    }
  });

  return (
    <div>
      <PageHeaderCard
        title="Thư viện media"
        description="Lưu trữ ảnh dùng chung để chọn lại nhanh cho banner, sản phẩm, công trình và bài viết."
        actions={
          <Upload {...uploadProps}>
            <Button type="primary" icon={<UploadOutlined />}>
              Tải ảnh lên
            </Button>
          </Upload>
        }
      />

      <Card className="admin-card">
        {mediaQuery.data?.items?.length ? (
          <div className="media-grid">
            {mediaQuery.data.items.map((item) => (
              <div key={item.id} className="media-grid__item">
                <Image src={item.url} alt={item.originalName} preview />
                <span>{item.originalName}</span>
                <Space>
                  <Popconfirm title="Xóa file media này?" okText="Xóa" cancelText="Hủy" onConfirm={() => deleteMutation.mutate(item.id)}>
                    <Button danger icon={<DeleteOutlined />} size="small">
                      Xóa
                    </Button>
                  </Popconfirm>
                </Space>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="Chưa có media nào" />
        )}
      </Card>
    </div>
  );
}
