import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <div className="section-pad">
      <Container width="prose">
        <p className="type-kicker text-accent mb-4">404</p>
        <h1 className="type-h1 mb-4">Không tìm thấy trang</h1>
        <p className="type-body text-secondary mb-8">
          Trang bạn tìm không tồn tại hoặc đã được di chuyển.
        </p>
        <Link href="/" className="type-small underline decoration-accent decoration-2 underline-offset-4">
          Về trang chủ
        </Link>
      </Container>
    </div>
  );
}
