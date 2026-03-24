import { useQuery } from "@tanstack/react-query";
import { Card, Col, List, Row, Spin } from "antd";
import {
  AppstoreOutlined,
  FileImageOutlined,
  FolderOutlined,
  HomeOutlined,
  MailOutlined
} from "@ant-design/icons";
import { adminApi } from "../api/adminApi";
import { PageHeaderCard } from "../components/common/PageHeaderCard";

const statMeta = [
  { key: "products", label: "Sản phẩm", icon: <AppstoreOutlined /> },
  { key: "categories", label: "Danh mục", icon: <FolderOutlined /> },
  { key: "projects", label: "Công trình", icon: <HomeOutlined /> },
  { key: "contacts", label: "Liên hệ", icon: <MailOutlined /> },
  { key: "banners", label: "Banner", icon: <FileImageOutlined /> }
];

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: adminApi.getDashboard
  });

  if (isLoading) {
    return (
      <div className="admin-loading">
        <Spin />
      </div>
    );
  }

  return (
    <div>
      <PageHeaderCard
        title="Tổng quan"
        description="Theo dõi nhanh toàn bộ nội dung website public và dữ liệu đang được quản trị."
      />

      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {statMeta.map((item) => (
          <div key={item.key} className="stat-box">
            <span style={{ color: "#b78b3f", fontSize: 20 }}>{item.icon}</span>
            <strong>{data?.[item.key] || 0}</strong>
            <span style={{ color: "#7b6b54" }}>{item.label}</span>
          </div>
        ))}
      </div>

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={12}>
          <Card className="admin-card" title="Checklist vận hành">
            <List
              dataSource={[
                "Banner trang chủ lấy dữ liệu động từ admin.",
                "Sản phẩm, danh mục và công trình được cập nhật qua API.",
                "Ảnh được tải lên hệ thống và lưu URL vào database.",
                "Trang tĩnh và metadata SEO có thể chỉnh sửa từ khu vực quản trị."
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card className="admin-card" title="Gợi ý quản trị">
            <List
              dataSource={[
                "Tải ảnh banner ngang lớn để hero section đẹp và sang hơn trên desktop.",
                "Đặt ảnh đại diện cho sản phẩm và công trình để card list đồng bộ hơn.",
                "Cập nhật meta title/meta description cho các trang tĩnh để tối ưu SEO cơ bản.",
                "Kiểm tra cấu hình môi trường trước khi tải ảnh thật lên hệ thống."
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
