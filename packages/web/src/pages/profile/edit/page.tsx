import { useUser } from "@/services/user";
import ChangeAvatar from "./_components/change-avatar";
import { Button } from "@/components/ui/button";
import GoBackButton from "@/components/go-back-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useSkills } from "@/services/profile/skills";
import TagsInput from "@/components/tags-input";
import { useUpdateProfile } from "@/services/profile/update";
import { useHeaderTitle } from "@/hooks/use-header-title";
import PageLoading from "@/components/page-loading";

const editProfileSchema = z.object({
  name: z.string().min(1).max(50),
  username: z.string().min(4).max(32),
  bio: z.string().min(1).max(600),
  profileImage: z.instanceof(File).optional(),
  skillIds: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
});

type FormValues = z.infer<typeof editProfileSchema>;

const EditProfile = () => {
  const { updateProfile, isPending: isUpdatePending } = useUpdateProfile();
  useHeaderTitle("Edit Profile");

  const { user, isPending: isUserPending } = useUser();
  const { skills, isPending: isSkillsPending } = useSkills();

  const form = useForm<FormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: "",
      username: "",
      bio: "",
      profileImage: undefined,
      skillIds: [],
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        username: user.username,
        bio: user.bio ?? "",
        profileImage: undefined,
        skillIds: user.skills,
      });
    }
  }, [user, form]);

  const [navigateTo, setNavigateTo] = useState<string | undefined>(undefined);

  const onSubmit = async (values: FormValues) => {
    const { profileImage, ...updateValues } = values;

    // Handle upload avatar to storage

    try {
      await updateProfile({
        ...updateValues,
        skillIds: values.skillIds.map((x) => x.id),
      });

      if (user?.username !== values.username) {
        setNavigateTo(`/${values.username}`);
      }
    } catch {
      //
    }
  };

  if (isUserPending || isSkillsPending) {
    return <PageLoading />;
  }

  if (!user) return null;

  return (
    <main>
      <div className="max-w-xl mx-auto py-10 space-y-6">
        <div className="flex justify-between">
          <GoBackButton navigateTo={navigateTo} />
          <Button
            variant="secondary"
            type="submit"
            form="edit-profile-form"
            disabled={isUpdatePending || !form.formState.isDirty}
          >
            Save changes
          </Button>
        </div>

        <Form {...form}>
          <form id="edit-profile-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="profileImage"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormControl>
                    <ChangeAvatar
                      name={user.name}
                      avatar={user.profileImageUrl}
                      onChange={onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skillIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <TagsInput
                      value={field.value || []}
                      onChange={field.onChange}
                      allTags={skills}
                      placeholder="Type to add skill"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </main>
  );
};

export default EditProfile;
