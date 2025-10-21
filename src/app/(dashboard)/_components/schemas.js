import { z } from "zod";

export const noticeFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z
    .any()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "Max image size is 5MB"
    )
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type)),
  learners: z.array(z.string()),
  mentors: z.array(z.string()),
  isImportant: z.boolean(),
  notificationTypes: z
    .array(z.string())
    .nonempty("At least one delivery method is required"),
});
