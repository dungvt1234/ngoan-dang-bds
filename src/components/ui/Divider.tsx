import { Container } from "./Container";

// Ngắt nhẹ duy nhất: 1 kiểu border-soft. Spacing do parent quyết định,
// Divider không tự thêm margin.
export function Divider({ className = "" }: { className?: string }) {
  return (
    <Container>
      <hr className={`border-t border-soft ${className}`} />
    </Container>
  );
}
