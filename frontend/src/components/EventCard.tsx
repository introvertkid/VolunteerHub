import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

export interface EventCardProps {
  eventId: number;
  title: string;
  description: string;
  categoryName: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  startAt: string;
  endAt: string;
  status: string;
  createdBy: string;
  registeredCount: number;
  isRegistered: boolean;
  isApproved: boolean;
}

export const EventCard = ({
  eventId,
  title,
  description,
  categoryName,
  address,
  city,
  district,
  ward,
  startAt,
  endAt,
  status,
  createdBy,
  registeredCount,
  isRegistered,
  isApproved,
}: EventCardProps) => {
  const fullAddress = `${address}, ${ward}, ${district}, ${city}`;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "environment":
        return "bg-primary/10 text-primary";
      case "charity":
        return "bg-secondary/10 text-secondary";
      case "education":
        return "bg-accent/10 text-accent";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:-translate-y-1">
      
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <Badge className={getCategoryColor(categoryName)}>
            {categoryName}
          </Badge>
        </div>
        <p className="text-muted-foreground line-clamp-2">{description}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Start date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{new Date(startAt).toLocaleDateString("vi-VN")}</span>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-secondary" />
          <span className="line-clamp-1">{fullAddress}</span>
        </div>

        {/* Participants */}
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-accent" />
          <span className="text-muted-foreground">
            {registeredCount} người tham gia
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" variant="default" asChild>
          <Link to={`/events/${eventId}`}>Xem chi tiết</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
