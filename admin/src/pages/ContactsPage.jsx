import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Descriptions, Modal, Popconfirm, Select, Space, Table, message } from "antd";
import dayjs from "dayjs";
import { adminApi } from "../api/adminApi";
import { PageHeaderCard } from "../components/common/PageHeaderCard";
import { StatusTag } from "../components/common/StatusTag";

export function ContactsPage() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);

  const contactsQuery = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: () => adminApi.getContacts({ limit: 100 })
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => adminApi.updateContactStatus(id, { status }),
    onSuccess: () => {
      message.success("Đã cập nhật trạng thái.");
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteContact,
    onSuccess: () => {
      message.success("Đã xóa liên hệ.");
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
    }
  });

  const columns = [
    { title: "Khách hàng", dataIndex: "name" },
    { title: "Liên hệ", render: (_, record) => record.phone || record.email },
    { title: "Chủ đề", dataIndex: "subject" },
    { title: "Trạng thái", dataIndex: "status", render: (value) => <StatusTag value={value} /> },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm")
    },
    {
      title: "Tác vụ",
      render: (_, record) => (
        <Space>
          <Button onClick={() => setSelected(record)}>Chi tiết</Button>
          <Popconfirm title="Xóa liên hệ này?" okText="Xóa" cancelText="Hủy" onConfirm={() => deleteMutation.mutate(record.id)}>
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <PageHeaderCard
        title="Quản lý liên hệ"
        description="Xem danh sách khách gửi form, kiểm tra chi tiết và đánh dấu đã xử lý."
      />

      <Table className="admin-card" rowKey="id" dataSource={contactsQuery.data?.items || []} columns={columns} />

      <Modal open={Boolean(selected)} footer={null} onCancel={() => setSelected(null)} title="Chi tiết liên hệ">
        {selected ? (
          <>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Họ tên">{selected.name}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{selected.phone || "-"}</Descriptions.Item>
              <Descriptions.Item label="Email">{selected.email || "-"}</Descriptions.Item>
              <Descriptions.Item label="Chủ đề">{selected.subject || "-"}</Descriptions.Item>
              <Descriptions.Item label="Nội dung">{selected.message}</Descriptions.Item>
            </Descriptions>
            <Space style={{ marginTop: 16 }}>
              <Select
                value={selected.status}
                style={{ width: 180 }}
                options={[
                  { value: "NEW", label: "Mới" },
                  { value: "PROCESSED", label: "Đã xử lý" }
                ]}
                onChange={(status) => {
                  updateMutation.mutate({ id: selected.id, status });
                  setSelected({ ...selected, status });
                }}
              />
            </Space>
          </>
        ) : null}
      </Modal>
    </div>
  );
}
