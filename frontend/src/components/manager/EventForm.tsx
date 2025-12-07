import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { createEvent, updateEvent, EventDetail } from '@/api/events';

// Zod validation schema
const eventSchema = z.object({
  title: z
    .string()
    .min(1, 'Tiêu đề không được để trống')
    .max(255, 'Tiêu đề tối đa 255 ký tự'),
  description: z
    .string()
    .max(2000, 'Mô tả tối đa 2000 ký tự')
    .optional()
    .or(z.literal('')),
  categoryId: z
    .string()
    .min(1, 'Vui lòng chọn danh mục'),
  address: z
    .string()
    .max(255, 'Địa chỉ tối đa 255 ký tự')
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .max(255, 'Thành phố tối đa 255 ký tự')
    .optional()
    .or(z.literal('')),
  district: z
    .string()
    .max(255, 'Quận/Huyện tối đa 255 ký tự')
    .optional()
    .or(z.literal('')),
  ward: z
    .string()
    .max(255, 'Phường/Xã tối đa 255 ký tự')
    .optional()
    .or(z.literal('')),
  startAt: z
    .string()
    .min(1, 'Thời gian bắt đầu không được để trống'),
  endAt: z
    .string()
    .min(1, 'Thời gian kết thúc không được để trống'),
}).refine((data) => {
  const start = new Date(data.startAt);
  const end = new Date(data.endAt);
  return end > start;
}, {
  message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
  path: ['endAt'],
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: EventDetail;
  onSuccess: () => void;
  onCancel: () => void;
}

// Categories - should ideally come from API
const categories = [
  { id: 1, name: 'Môi trường' },
  { id: 2, name: 'Giáo dục' },
  { id: 3, name: 'Y tế' },
  { id: 4, name: 'Cộng đồng' },
  { id: 5, name: 'Từ thiện' },
];

const EventForm = ({ event, onSuccess, onCancel }: EventFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!event;

  // Find category ID from category name for editing
  const getCategoryIdFromName = (name: string): string => {
    const category = categories.find(c => c.name === name);
    return category ? category.id.toString() : '';
  };

  // Format datetime for input
  const formatDateTimeForInput = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      categoryId: event ? getCategoryIdFromName(event.categoryName) : '',
      address: event?.address || '',
      city: event?.city || '',
      district: event?.district || '',
      ward: event?.ward || '',
      startAt: event ? formatDateTimeForInput(event.startAt) : '',
      endAt: event ? formatDateTimeForInput(event.endAt) : '',
    },
  });

  const selectedCategoryId = watch('categoryId');

  const onSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      
      // Format dates to ISO string with Z suffix
      const formatToISO = (dateTimeLocal: string): string => {
        const date = new Date(dateTimeLocal);
        return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
      };

      const payload = {
        title: data.title,
        description: data.description || undefined,
        categoryId: parseInt(data.categoryId),
        address: data.address || undefined,
        city: data.city || undefined,
        district: data.district || undefined,
        ward: data.ward || undefined,
        startAt: formatToISO(data.startAt),
        endAt: formatToISO(data.endAt),
      };

      if (isEditing && event) {
        await updateEvent(event.eventId, payload);
        toast.success('Cập nhật sự kiện thành công!');
      } else {
        await createEvent(payload);
        toast.success('Tạo sự kiện thành công!');
      }
      
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.message || (isEditing ? 'Cập nhật thất bại' : 'Tạo sự kiện thất bại');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Tiêu đề sự kiện *</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Nhập tiêu đề sự kiện"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Mô tả chi tiết về sự kiện"
          rows={4}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Danh mục *</Label>
        <Select
          value={selectedCategoryId}
          onValueChange={(value) => setValue('categoryId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-sm text-destructive">{errors.categoryId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startAt">Thời gian bắt đầu *</Label>
          <Input
            id="startAt"
            type="datetime-local"
            {...register('startAt')}
          />
          {errors.startAt && (
            <p className="text-sm text-destructive">{errors.startAt.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endAt">Thời gian kết thúc *</Label>
          <Input
            id="endAt"
            type="datetime-local"
            {...register('endAt')}
          />
          {errors.endAt && (
            <p className="text-sm text-destructive">{errors.endAt.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Địa chỉ</Label>
        <Input
          id="address"
          {...register('address')}
          placeholder="Số nhà, tên đường"
        />
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ward">Phường/Xã</Label>
          <Input
            id="ward"
            {...register('ward')}
            placeholder="Phường/Xã"
          />
          {errors.ward && (
            <p className="text-sm text-destructive">{errors.ward.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">Quận/Huyện</Label>
          <Input
            id="district"
            {...register('district')}
            placeholder="Quận/Huyện"
          />
          {errors.district && (
            <p className="text-sm text-destructive">{errors.district.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Thành phố</Label>
          <Input
            id="city"
            {...register('city')}
            placeholder="Thành phố"
          />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isEditing ? 'Cập nhật' : 'Tạo sự kiện'}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
