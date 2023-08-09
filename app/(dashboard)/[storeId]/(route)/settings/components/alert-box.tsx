"use client";
import { Copy, Server } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface AlertBoxProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}
const textMap: Record<AlertBoxProps["variant"], string> = {
  admin: "Admin",
  public: "Public",
};
const variantMap: Record<AlertBoxProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};
const AlertBox = ({ title, variant, description }: AlertBoxProps) => {
  function copyToClickBoard() {
    navigator.clipboard.writeText(description);
    return toast({
      title: "API Route copied to the clipboard.",
    });
  }
  return (
    <Alert>
      <Server className="h-4 w-4 mt-1" />
      <AlertTitle className="flex gap-2 items-center text-sm">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="flex justify-between items-center">
        <code className="rounded-full bg-muted px-2">{description}</code>
        <Button variant={"ghost"} onClick={copyToClickBoard}>
          <Copy className={"h-4 w-4"} />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
export default AlertBox;
