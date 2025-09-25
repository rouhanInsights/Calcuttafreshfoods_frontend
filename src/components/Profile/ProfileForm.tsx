"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, AtSign, Phone, Smartphone } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  alt_email: z.string().optional().or(z.literal("")),
  phone: z.string().min(10),
  alt_phone: z.string().optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other"]),
  dob: z.string(),
  profile_image: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      alt_email: "",
      phone: "",
      alt_phone: "",
      gender: "male",
      dob: "",
      profile_image: "",
    },
  });

  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        form.reset({
          name: data.name ?? "",
          email: data.email ?? "",
          alt_email: data.alt_email ?? "",
          phone: data.phone ?? "",
          alt_phone: data.alt_phone ?? "",
          gender: data.gender ?? "male",
          dob: data.dob ? format(new Date(data.dob), "yyyy-MM-dd") : "",
          profile_image: data.profile_image_url ?? "",
        });
        if (data.profile_image_url) setAvatarPreview(data.profile_image_url);
      })
      .catch((err) => console.error("Profile fetch failed:", err));
  }, [token, form]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload/profile-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const imageUrl = data.imageUrl;

      setAvatarPreview(imageUrl);
      form.setValue("profile_image", imageUrl);

      // ✅ Get the full current form values
      const current = form.getValues();

      const payload = {
        ...current,
        alt_email: current.alt_email?.trim() || null,
        alt_phone: current.alt_phone?.trim() || null,
        profile_image_url: imageUrl, // ✅ Save image URL
      };

      const updateRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!updateRes.ok) {
        toast.warning("Image uploaded but profile update failed.");
      } else {
        toast.success("Profile image updated successfully!");
      }
    } catch (err) {
      toast.error("Image upload failed", {
        description: (err as Error).message,
      });
    }
  };

  const handleRemoveAvatar = async () => {
    if (!token) return;

    try {
      const current = form.getValues();

      const payload = {
        ...current,
        alt_email: current.alt_email?.trim() || null,
        alt_phone: current.alt_phone?.trim() || null,
        profile_image_url: null, // ✅ Remove image from DB
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to remove profile image");

      setAvatarPreview("");
      form.setValue("profile_image", "");

      toast.success("Profile image removed successfully");
    } catch (err) {
      toast.error("❌ Failed to remove image", {
        description: (err as Error).message,
      });
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!token) return;
    setIsLoading(true);

    const sanitizedData = {
      ...data,
      alt_email: data.alt_email?.trim() || null,
      alt_phone: data.alt_phone?.trim() || null,
      profile_image_url: data.profile_image ?? null,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(sanitizedData),
        }
      );

      if (!res.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("❌ Update failed", {
        description: (err as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initials =
    form
      .watch("name")
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "U";

  return (
    <div className="space-y-8 rounded-xl pt-6 ">
      <div className="text-xl font-semibold text-gray-800">
        Personal Information
      </div>

      <div className="flex flex-col sm:flex-row gap-6 bg-white p-6 sm:p-8 rounded-2xl border-gray-100 transition-all">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3">
          <Avatar className="w-24 h-24 border-4 border-[#8BAD2B]/30 shadow">
            <AvatarImage src={avatarPreview || ""} />
            <AvatarFallback className="bg-[#8BAD2B] text-xl text-white">
              {initials}
            </AvatarFallback>
          </Avatar>

          <Label
            htmlFor="avatar"
            className="cursor-pointer text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            Change Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="avatar"
              onChange={handleAvatarChange}
            />
          </Label>

          {avatarPreview && (
            <Button
              variant="ghost"
              className="text-sm text-red-500 hover:text-red-700 px-2 py-1"
              onClick={handleRemoveAvatar}
            >
              Remove Photo
            </Button>
          )}
        </div>

        {/* Form Section */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        className="pl-10 rounded-md border-gray-300 focus:ring-2 focus:ring-[#8BAD2B]/30"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          className="pl-10 rounded-md border-gray-300 focus:ring-2 focus:ring-[#8BAD2B]/30"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alt_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternate Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          className="pl-10 rounded-md border-gray-300 focus:ring-2 focus:ring-[#8BAD2B]/30"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Phone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          className="pl-10 rounded-md border-gray-300 focus:ring-2 focus:ring-[#8BAD2B]/30"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alt_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternate Phone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          className="pl-10 rounded-md border-gray-300 focus:ring-2 focus:ring-[#8BAD2B]/30"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full rounded-md border-gray-300 focus:ring-2 focus:ring-[#8BAD2B]/30">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent side="top" className="bg-white">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal w-full rounded-md border-gray-300 focus:ring-2 focus:ring-[#8BAD2B]/30",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>DD_MM_YYYY</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-white shadow-md rounded-md border"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : ""
                            )
                          }
                          captionLayout="dropdown"
                          fromYear={1950}
                          toYear={new Date().getFullYear()}
                          className="rounded-md bg-white"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="bg-[#8BAD2B] text-white hover:bg-[#779624] w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
