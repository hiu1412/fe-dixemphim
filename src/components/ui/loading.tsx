import { Loader2 } from "lucide-react";

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export function Loading({ text = "Đang tải...", fullScreen = false }: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="flex items-center justify-center min-h-screen">
          {content}
        </div>
      </div>
    );
  }

  return content;
}