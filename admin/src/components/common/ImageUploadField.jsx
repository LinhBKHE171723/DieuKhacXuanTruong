import { useEffect, useRef } from "react";
import { Button, Image, Space, Upload, message } from "antd";
import { PlusOutlined, StarFilled, DeleteOutlined } from "@ant-design/icons";
import { adminApi } from "../../api/adminApi";

const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const bannerAcceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const galleryAcceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const bannerImageSpec = { width: 1280, height: 720 };
const bannerAspectRatio = bannerImageSpec.width / bannerImageSpec.height;
const bannerAspectTolerance = 0.015;

const normalizeValue = (value, multiple) => {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  return multiple ? [value] : [value];
};

export function ImageUploadField({ value, onChange, folder = "media", multiple = false }) {
  const items = normalizeValue(value, multiple);
  const itemsRef = useRef(items);
  const allowedTypes =
    folder === "banners"
      ? bannerAcceptedImageTypes
      : folder === "products" || folder === "projects" || folder === "pages"
        ? galleryAcceptedImageTypes
        : acceptedImageTypes;
  const accept = allowedTypes.join(",");

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const readImageDimensions = (file) =>
    new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new window.Image();

      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({
          width: image.naturalWidth,
          height: image.naturalHeight
        });
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Không thể đọc kích thước ảnh."));
      };

      image.src = objectUrl;
    });

  const commit = (next) => {
    itemsRef.current = next;

    if (multiple) {
      onChange(next);
      return;
    }
    onChange(next[0] || null);
  };

  const uploadProps = {
    showUploadList: false,
    multiple,
    accept,
    beforeUpload: async (file) => {
      if (!allowedTypes.includes(file.type)) {
        message.error(
          folder === "banners"
            ? "Banner chỉ chấp nhận file ảnh JPG, PNG hoặc WEBP."
            : folder === "products" || folder === "projects" || folder === "pages"
              ? "Ảnh sản phẩm, công trình và bài viết chỉ chấp nhận file ảnh JPG, PNG hoặc WEBP."
            : "Chỉ chấp nhận file ảnh JPG, PNG, WEBP, GIF hoặc SVG."
        );
        return Upload.LIST_IGNORE;
      }

      if (file.size > 10 * 1024 * 1024) {
        message.error("Dung lượng ảnh tối đa là 10MB.");
        return Upload.LIST_IGNORE;
      }

      if (folder === "banners") {
        try {
          const { width, height } = await readImageDimensions(file);
          const ratio = width / height;
          if (Math.abs(ratio - bannerAspectRatio) > bannerAspectTolerance) {
            message.error(
              `Vui lòng chọn ảnh banner theo khung ngang, ví dụ ${bannerImageSpec.width} x ${bannerImageSpec.height} hoặc các ảnh ngang tương tự.`
            );
            return Upload.LIST_IGNORE;
          }
        } catch (error) {
          message.error(error.message || "Không thể kiểm tra kích thước ảnh banner.");
          return Upload.LIST_IGNORE;
        }
      }

      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const uploaded = await adminApi.uploadMedia({ files: [file], folder });
        const currentItems = itemsRef.current;
        const nextItems = multiple
          ? [
              ...currentItems,
              ...uploaded.map((item, index) => ({
                ...item,
                sortOrder: currentItems.length + index,
                isPrimary: currentItems.length === 0 && index === 0
              }))
            ]
          : [{ ...uploaded[0], isPrimary: true, sortOrder: 0 }];
        commit(nextItems);
        message.success({
          key: `upload-${folder}`,
          content: multiple ? "Đã thêm ảnh vào bộ sưu tập." : "Tải ảnh thành công."
        });
        onSuccess?.("ok");
      } catch (error) {
        message.error(error.message || "Tải ảnh thất bại.");
        onError?.(error);
      }
    }
  };

  const removeItem = (index) => {
    const next = items.filter((_, itemIndex) => itemIndex !== index).map((item, itemIndex) => ({
      ...item,
      sortOrder: itemIndex,
      isPrimary: itemIndex === 0 ? true : item.isPrimary
    }));
    if (next.length && !next.some((item) => item.isPrimary)) {
      next[0].isPrimary = true;
    }
    commit(next);
  };

  const setPrimary = (index) => {
    const next = items.map((item, itemIndex) => ({
      ...item,
      isPrimary: itemIndex === index
    }));
    commit(next);
  };

  const updateAlt = (index, altText) => {
    const next = items.map((item, itemIndex) => (itemIndex === index ? { ...item, altText } : item));
    commit(next);
  };

  return (
    <>
      <Space wrap>
        <Upload {...uploadProps}>
          <Button icon={<PlusOutlined />}>Tải ảnh lên</Button>
        </Upload>
      </Space>

      <div className="upload-preview-grid">
        {items.map((item, index) => (
          <div key={`${item.url}-${index}`} className="upload-preview-card">
            <Image src={item.url} alt={item.altText || `image-${index}`} preview={false} />
            <div className="upload-preview-card__actions">
              {multiple ? (
                <Button
                  type={item.isPrimary ? "primary" : "default"}
                  icon={<StarFilled />}
                  size="small"
                  onClick={() => setPrimary(index)}
                >
                  Ảnh đại diện
                </Button>
              ) : null}
              <Button danger size="small" icon={<DeleteOutlined />} onClick={() => removeItem(index)}>
                Xóa
              </Button>
            </div>
            <input
              className="upload-preview-card__input"
              type="text"
              value={item.altText || ""}
              placeholder="Mô tả ảnh (alt text)"
              onChange={(event) => updateAlt(index, event.target.value)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
