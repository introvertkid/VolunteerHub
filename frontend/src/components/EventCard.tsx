import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ArrowUpRight, TreePine, Heart, BookOpen, Sparkles } from "lucide-react";
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
  const fullAddress = `${ward}, ${district}`;

  const getCategoryConfig = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "environment":
      case "môi trường":
        return { 
          color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", 
          icon: TreePine,
          gradient: "from-emerald-500/20 to-teal-500/20"
        };
      case "charity":
      case "từ thiện":
        return { 
          color: "bg-rose-500/10 text-rose-600 border-rose-500/20", 
          icon: Heart,
          gradient: "from-rose-500/20 to-pink-500/20"
        };
      case "education":
      case "giáo dục":
        return { 
          color: "bg-blue-500/10 text-blue-600 border-blue-500/20", 
          icon: BookOpen,
          gradient: "from-blue-500/20 to-indigo-500/20"
        };
      default:
        return { 
          color: "bg-primary/10 text-primary border-primary/20", 
          icon: Sparkles,
          gradient: "from-primary/20 to-accent/20"
        };
    }
  };

  const categoryConfig = getCategoryConfig(categoryName);
  const CategoryIcon = categoryConfig.icon;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString("vi-VN", { month: "short" });
    return { day, month };
  };

  const { day, month } = formatDate(startAt);

  return (
    <Card className="group relative overflow-hidden border-border/50 hover:border-primary/30 bg-gradient-to-b from-card to-card/80 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2">
      {/* Category gradient overlay */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${categoryConfig.gradient}`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          {/* Date badge */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-muted/50 border border-border/50 group-hover:border-primary/30 transition-colors">
            <span className="text-lg font-bold text-foreground leading-none">{day}</span>
            <span className="text-[10px] uppercase text-muted-foreground font-medium">{month}</span>
          </div>
          
          {/* Title and category */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={`${categoryConfig.color} text-xs font-medium gap-1 px-2`}>
                <CategoryIcon className="h-3 w-3" />
                {categoryName}
              </Badge>
            </div>
            <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
        
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate max-w-[120px]">{fullAddress}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{registeredCount} người</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button 
          className="w-full group/btn gap-2 bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90" 
          size="sm"
          asChild
        >
          <Link to={`/events/${eventId}`}>
            Xem chi tiết
            <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
      
      {/* Hover decoration */}
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-primary/5 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </Card>
  );
};
