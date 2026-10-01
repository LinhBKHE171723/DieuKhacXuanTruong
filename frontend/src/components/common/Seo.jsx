import { Helmet } from "react-helmet-async";

export function Seo({ description }) {
  return (
    <Helmet>
      <title>Điêu Khắc Xuân Trường</title>
      {description ? <meta name="description" content={description} /> : null}
    </Helmet>
  );
}
