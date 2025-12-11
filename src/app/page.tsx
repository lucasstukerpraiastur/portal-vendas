import { Loader2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4 text-gray-400">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Carregando sistema...</p>
      </div>
    </div>
  );
}
