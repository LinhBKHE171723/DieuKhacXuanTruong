import { Helmet } from "react-helmet-async";

export function Seo({ title, description }) {
  return (
    <Helmet>
      {title ? <title>{title}</title> : null}
      {description ? <meta name="description" content={description} /> : null}
    </Helmet>
  );
}
