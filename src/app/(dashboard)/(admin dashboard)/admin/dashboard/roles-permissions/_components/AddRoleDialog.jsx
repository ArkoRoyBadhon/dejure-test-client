"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  useCreateStaffRoleMutation,
  useGetModulesQuery,
  useUpdateStaffRoleMutation,
} from "@/redux/features/auth/staff.api";
import ModulePermissions from "./ModulePermissions";
import { toast } from "sonner";

const roleFormSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
  type: z.string().default("custom"),
  isActive: z.boolean().default(true),
  moduleAccess: z.array(
    z.object({
      module: z.string(),
      isEnabled: z.boolean(),
      permissions: z.array(z.enum(["view", "write", "delete"])),
    })
  ),
});

export const AddRoleDialog = ({ roleToEdit = null, children }) => {
  const [open, setOpen] = useState(false);
  const [createStaffRole] = useCreateStaffRoleMutation();
  const [updateStaffRole] = useUpdateStaffRoleMutation();
  const { data: allModules } = useGetModulesQuery();

  const form = useForm({
    resolver: zodResolver(roleFormSchema),
    defaultValues: roleToEdit || {
      name: "",
      description: "",
      type: "custom",
      isActive: true,
      moduleAccess: [],
    },
  });

  // Initialize moduleAccess when modules are loaded or when editing
  useEffect(() => {
    if (allModules) {
      if (roleToEdit) {
        // For edit mode, merge existing moduleAccess with any new modules
        const existingModules = roleToEdit.moduleAccess || [];
        const mergedModuleAccess = allModules.map((module) => {
          const existingModule = existingModules.find(
            (m) => m.module === module._id
          );
          return (
            existingModule || {
              module: module._id,
              isEnabled: false,
              permissions: [],
            }
          );
        });
        form.reset({
          ...roleToEdit,
          moduleAccess: mergedModuleAccess,
        });
      } else {
        // For create mode, initialize all modules as disabled
        const initialModuleAccess = allModules.map((module) => ({
          module: module._id,
          isEnabled: false,
          permissions: [],
        }));
        form.reset({
          name: "",
          description: "",
          type: "custom",
          isActive: true,
          moduleAccess: initialModuleAccess,
        });
      }
    }
  }, [allModules, roleToEdit, form]);

  const onSubmit = async (values) => {
    try {
      if (roleToEdit) {
        await updateStaffRole({
          id: roleToEdit._id,
          ...values,
        }).unwrap();
        toast.success("Role updated successfully");
      } else {
        await createStaffRole(values).unwrap();
        toast.success("Role created successfully");
      }
      setOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "An error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-xs md:text-sm bg-[#001C44]/90 hover:bg-[#001C44] text-white hover:text-white"
          >
            <Plus className="h-4 w-4" />
            {roleToEdit ? "Edit Role" : "Add Role"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {roleToEdit ? "Edit Role" : "Create New Role"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Content Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the purpose of this role..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h3 className="font-medium mb-4">Module Permissions</h3>
              <div className="space-y-4">
                {allModules?.map((module) => (
                  <ModulePermissions
                    key={module._id}
                    module={module}
                    control={form.control}
                    setValue={form.setValue}
                    getValues={form.getValues}
                    watch={form.watch}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {roleToEdit ? "Update Role" : "Create Role"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
