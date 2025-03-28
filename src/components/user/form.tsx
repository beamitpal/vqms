"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { createUserFromForm } from "@/actions/users/business";


const staticFieldsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  address: z.string().optional(),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
      "Invalid phone number format (e.g., +1234567890)"
    ),
  notes: z.string().optional(),
});


function createDynamicSchema(customFields: {
  [key: string]: { type: string; defaultValue: string };
}) {
  const shape: { [key: string]: z.ZodTypeAny } = {};
  Object.entries(customFields).forEach(([key, field]) => {
    switch (field.type) {
      case "text":
        shape[key] = z.string().min(1, `${key} is required`);
        break;
      case "textarea":
        shape[key] = z.string().min(1, `${key} is required`);
        break;
      default:
        shape[key] = z.string().optional();
    }
  });
  return staticFieldsSchema.extend(shape);
}

interface DynamicUserFormProps {
  projectId: string;
  customFields: { [key: string]: { type: string; defaultValue: string } };
  toLink: string;
}

export default function DynamicUserForm({
  projectId,
  customFields,
  toLink,
}: DynamicUserFormProps) {
  const router = useRouter();

  const staticDefaultValues = {
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
    notes: "",
  };

  const customDefaultValues = Object.fromEntries(
    Object.entries(customFields).map(([key, field]) => [
      key,
      field.defaultValue,
    ])
  );

  const defaultValues = { ...staticDefaultValues, ...customDefaultValues };

  const formSchema = createDynamicSchema(customFields);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await createUserFromForm(projectId, values);
    if (result.success) {
      toast.success("✅ Successfully joined the project!");
      router.push("/" + toLink); // Adjust redirect as needed
    } else {
      toast.error(
        `❌ ${result.error || "Failed to submit form. Please try again."}`
      );
    }
  }

  return (
    <Card className="bg-background w-full max-w-md sm:max-w-lg md:max-w-xl mx-4 sm:mx-auto">
      <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-xl font-bold">Join Business Queue</CardTitle>
        <CardDescription className="text-muted-foreground">
          Fill out the form below to join the queue.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-5"
          >
          
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your address"
                      disabled={form.formState.isSubmitting}
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your phone number (e.g., +1234567890)"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes"
                      disabled={form.formState.isSubmitting}
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          
            {Object.entries(customFields).map(([fieldName, field]) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{fieldName}</FormLabel>
                    <FormControl>
                      {field.type === "text" ? (
                        <Input
                          placeholder={`Enter ${fieldName}`}
                          disabled={form.formState.isSubmitting}
                          {...formField}
                        />
                      ) : field.type === "textarea" ? (
                        <Textarea
                          placeholder={`Enter ${fieldName}`}
                          disabled={form.formState.isSubmitting}
                          className="min-h-[80px]"
                          {...formField}
                        />
                      ) : (
                        <Input
                          placeholder={`Enter ${fieldName}`}
                          disabled={form.formState.isSubmitting}
                          {...formField}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button
              type="submit"
              className="w-full mt-4 sm:mt-6"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
