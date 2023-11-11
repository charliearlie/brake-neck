import {
  conform,
  list,
  useFieldList,
  useFieldset,
  useForm,
} from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import Card from "~/components/common/ui/card/card";
import CardContent from "~/components/common/ui/card/card-content";
import {
  AddressFieldsetSchema,
  PersonalDetailsFieldsetSchema,
} from "~/services/schemas.server";
import {
  getUser,
  updateUserAddresses,
  updateUserAvatar,
  updateUserPersonalDetails,
} from "~/services/user.server";
import { invariantResponse } from "~/util/utils";
import { AddressFieldset } from "./form/address-fieldset";
import { UserDetailsFieldset } from "./form/user-details-fieldset";
import { Separator } from "~/components/common/ui/separator";
import { SubmitButton } from "~/components/form/submit-button";
import { Button } from "~/components/common/ui/button";
import FormField from "~/components/form/form-field";
import { ImageUploadAvatar } from "~/components/form/image-upload-avatar";

const ManageUserFormSchema = z.object({
  personalDetails: PersonalDetailsFieldsetSchema,
  addresses: z.array(AddressFieldsetSchema),
  email: z.string().email(),
  password: z
    .string({
      required_error: "Please enter your password to update your profile",
    })
    .min(8),
  avatarImage: z.string().optional(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parse(formData, { schema: ManageUserFormSchema });

  if (submission.intent !== "submit" || !submission.value) {
    return json({ status: "idle", submission } as const);
  }

  const user = await getUser(request);
  if (!user) {
    throw new Response("User not logged in", { status: 404 });
  }

  if (typeof submission.value.avatarImage === "string") {
    await updateUserAvatar(submission.value.avatarImage, user.id);
  }

  const updatedUserAddresses = await updateUserAddresses(
    submission.value.addresses,
    user.id
  );

  const updatedUser = await updateUserPersonalDetails(
    submission.value.personalDetails,
    user.id
  );

  // todo: add good error/success messages
  return json({
    status: updatedUserAddresses && updatedUser ? "success" : "error",
    submission,
  } as const);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);

  invariantResponse(user, "User not logged in", { status: 404 });
  user.password = "";
  return json({ user });
};

export default function ManageUserRoute() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    id: "manage-user-form",
    constraint: getFieldsetConstraint(ManageUserFormSchema),
    lastSubmission: actionData?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: ManageUserFormSchema });
    },
    shouldValidate: "onBlur",
    defaultValue: {
      email: user.email,
      personalDetails: {
        firstName: user.personalDetails?.firstName || "",
        lastName: user.personalDetails?.lastName || "",
      },
      addresses: user.addresses.length ? user.addresses : [{}],
    },
  });

  console.log("actionData", actionData);

  const userData = useFieldset(form.ref, fields.personalDetails);
  const addresses = useFieldList(form.ref, fields.addresses);

  const hasAddressStored = user.addresses.length > 0;
  if (user) {
    return (
      <Card>
        <CardContent className="md:p-8">
          <Form method="post" {...form.props}>
            <div className="flex flex-col items-center justify-between gap-4 lg:flex-row lg:items-start lg:gap-8">
              <ImageUploadAvatar
                className="h-[172px] w-[172px] basis-1/4 rounded-lg"
                src={user.avatarUrl || undefined}
                fieldProps={{ ...conform.input(fields.avatarImage) }}
              />
              <div className="flex w-full flex-col gap-0.5 lg:basis-3/4">
                <FormField
                  label="Email"
                  {...conform.input(fields.email, { type: "email" })}
                  helperText="Contact support to change your email address"
                />
                <FormField
                  label="Password"
                  {...conform.input(fields.password, { type: "password" })}
                />
              </div>
            </div>
            <UserDetailsFieldset user={userData} />
            <Separator />
            <h3 className="py-4 text-lg font-semibold">Addresses</h3>
            {addresses.map((address, index) => (
              <>
                {index > 0 && <Separator />}
                <AddressFieldset key={address.id} address={address} />
              </>
            ))}
            <div className="flex justify-center py-2">
              {hasAddressStored && (
                <Button
                  variant="outline"
                  {...list.insert(fields.addresses.name, {})}
                >
                  Add address
                </Button>
              )}
            </div>
            <SubmitButton>Save changes</SubmitButton>
          </Form>
        </CardContent>
      </Card>
    );
  }
}
