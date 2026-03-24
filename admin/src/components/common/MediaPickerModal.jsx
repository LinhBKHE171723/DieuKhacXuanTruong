import { useEffect, useState } from "react";
import { Button, Empty, Image, Modal, Spin } from "antd";
import { adminApi } from "../../api/adminApi";

export function MediaPickerModal({ open, onCancel, onSelect, multiple = false }) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setLoading(true);
    adminApi
      .getMedia({ limit: 100 })
      .then((response) => setItems(response.items))
      .finally(() => setLoading(false));
  }, [open]);

  const toggleSelect = (item) => {
    if (multiple) {
      setSelected((current) => {
        const exists = current.find((entry) => entry.id === item.id);
        return exists ? current.filter((entry) => entry.id !== item.id) : [...current, item];
      });
      return;
    }

    setSelected([item]);
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      width={920}
      title="Thư viện media"
      okText="Chọn ảnh"
      cancelText="Hủy"
      onOk={() => {
        onSelect(selected);
        setSelected([]);
      }}
      okButtonProps={{ disabled: !selected.length }}
    >
      {loading ? (
        <div className="admin-loading">
          <Spin />
        </div>
      ) : items.length ? (
        <div className="media-grid">
          {items.map((item) => {
            const active = selected.some((entry) => entry.id === item.id);
            return (
              <button
                type="button"
                key={item.id}
                className={`media-grid__item ${active ? "is-active" : ""}`}
                onClick={() => toggleSelect(item)}
              >
                <Image src={item.url} alt={item.originalName} preview={false} />
                <span>{item.originalName}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <Empty description="Chưa có media nào" />
      )}
      <div className="modal-hint">
        <Button type="link" onClick={() => setSelected([])}>
          Bỏ chọn
        </Button>
      </div>
    </Modal>
  );
}
