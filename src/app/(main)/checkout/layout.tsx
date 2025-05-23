import { ErrorBoundary } from "@/components/error-boundary";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <main>{children}</main>
    </ErrorBoundary>
  );
}