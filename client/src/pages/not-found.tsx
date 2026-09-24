import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  // Debug information for GitHub Pages deployment
  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;
  const isGitHubPages = currentPath.includes('/video-transcript') || (window as any).ghPagesDebug;
  
  console.error('404 NotFound component rendered:', {
    currentPath,
    currentSearch,
    isGitHubPages,
    fullURL: window.location.href
  });
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("notFound.title")}</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            {t("notFound.description")}
          </p>
          
          
          <div className="mt-6">
            <a 
              href={isGitHubPages ? '/video-transcript/' : '/'}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Go Home
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
