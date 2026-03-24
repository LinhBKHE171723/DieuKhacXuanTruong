import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"]
  ]
};

export function RichTextEditor({ value, onChange }) {
  return <ReactQuill theme="snow" value={value || ""} onChange={onChange} modules={modules} />;
}
