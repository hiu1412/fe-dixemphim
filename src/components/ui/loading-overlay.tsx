import { Loading } from "./loading";

interface LoadingOverlayProps {
  text?: string;
  isLoading: boolean;
}

export function LoadingOverlay({ text, isLoading }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Loading text={text} />
    </div>
  );
}