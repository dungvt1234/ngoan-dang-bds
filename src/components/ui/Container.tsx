import type { ReactNode } from "react";

// Khung chứa duy nhất toàn site. Mọi page dùng 1 trong 4 width,
// không tự đặt max-w riêng trong component.
type ContainerWidth = "default" | "prose" | "detail" | "wide";

const widths: Record<ContainerWidth, string> = {
  default: "max-w-[1200px]", // page chuẩn, listing, detail
  prose: "max-w-[740px]", // bài viết, legal, about — cột chữ hẹp
  detail: "max-w-[1000px]", // project detail (bảng, timeline)
  wide: "max-w-[1400px]", // hero image, gallery, bảng so sánh
};

export function Container({
  width = "default",
  children,
  className = "",
}: {
  width?: ContainerWidth;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full px-5 md:px-8 lg:px-10 ${widths[width]} ${className}`}>
      {children}
    </div>
  );
}
