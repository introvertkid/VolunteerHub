import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  participants?: number;
  currentParticipants?: number;
  maxParticipants?: number;
  imageUrl?: string;
  image?: string;
}

export const EventCard = ({
  id,
  title,
  description,
  date,
  location,
  category,
  participants = 0,
  currentParticipants,
  maxParticipants,
  imageUrl,
  image,
}: EventCardProps) => {
  const displayImage = imageUrl || image;
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
      {displayImage && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <Badge className={getCategoryColor(category)}>
            {category === "environment" ? "Môi trường" : category === "charity" ? "Từ thiện" : "Giáo dục"}
          </Badge>
        </div>
        <p className="text-muted-foreground line-clamp-2">{description}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{new Date(date).toLocaleDateString("vi-VN")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-secondary" />
          <span className="line-clamp-1">{location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-accent" />
          <span className="text-muted-foreground">
            {currentParticipants ?? participants}/{maxParticipants || '∞'} người tham gia
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" variant="default" asChild>
          <Link to={`/events/${id}`}>Xem chi tiết</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
