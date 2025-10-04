import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const ChatbotPreview = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating chatbot button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-glow bg-gradient-to-br from-accent to-accent/80 hover:scale-110 transition-all duration-300 z-50"
        size="icon"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {/* Chatbot preview card */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 shadow-card border-border/50 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gradient-to-r from-accent to-accent/80 p-4 rounded-t-lg">
            <h3 className="font-semibold text-white">LUMENO Assistant</h3>
            <p className="text-xs text-white/80">Ask me anything!</p>
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-muted rounded-lg p-3 text-sm">
              👋 Hello! I'm here to help you navigate LUMENO. How can I assist you today?
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" className="text-xs">Find sellers near me</Button>
              <Button size="sm" variant="outline" className="text-xs">How to start selling?</Button>
              <Button size="sm" variant="outline" className="text-xs">Verification process</Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ChatbotPreview;
