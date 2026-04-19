import { Link } from "react-router-dom";
import { Rocket, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type ComingSoonProps = {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  className?: string;
};

export default function ComingSoon({
  title = "Coming Soon",
  description = "We're working on something exciting. Check back later for updates.",
  showBackButton = true,
  className,
}: ComingSoonProps) {
  return (
    <div className={`flex min-h-[50vh] items-center justify-center ${className ?? ""}`}>
      <Card className="w-full max-w-md border-2">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Rocket className="size-8 text-primary" />
          </div>
          <Badge variant="secondary" className="mb-2">
            In development
          </Badge>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {showBackButton && (
            <Button asChild variant="outline" className="w-full gap-2">
              <Link to="/">
                <ArrowLeft className="size-4" />
                Back to home
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
