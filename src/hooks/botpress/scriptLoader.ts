
import { useToast } from "@/hooks/use-toast";

// Manages loading the Botpress webchat script
export const useScriptLoader = (showWidget: boolean) => {
  const { toast } = useToast();
  
  const loadScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!showWidget) {
        resolve(false);
        return;
      }
      
      const existingScript = document.getElementById('botpressScript');
      if (existingScript) {
        console.log('Botpress script already loaded');
        resolve(true);
        return;
      }

      // Load the Botpress webchat script
      const script = document.createElement('script');
      script.id = 'botpressScript';
      script.src = "https://cdn.botpress.cloud/webchat/v2.3/webchat.js";
      script.async = true;
      
      // Handle script loading completion
      script.onload = () => {
        console.log("Botpress script loaded successfully");
        resolve(true);
      };
      
      script.onerror = () => {
        console.error("Failed to load Botpress script");
        toast({
          title: "AI Assistant Error",
          description: "Failed to load the AI assistant. Please refresh the page.",
          variant: "destructive"
        });
        resolve(false);
      };
      
      document.body.appendChild(script);
    });
  };

  return { loadScript };
};
