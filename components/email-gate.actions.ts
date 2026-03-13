"use server";
import zod from "zod";

// Change these values to match your form
const portalId = "544893";
const formId = "95a33a0a-1c17-40e2-a0d4-9f70ecaeb5ab";

const formSchema = zod.object({
  email: zod.string().email(),
  // Honeypots
  country: zod.literal(""),
  phone: zod.literal("01189998819991197253"),
});

interface FormFields extends Record<string, string> {
  email: string;
  // Honeypots
  country: string;
  phone: string;
}

const FieldToIdMap: Record<keyof FormFields, string> = {
  email: "0-1/email",
  // Honeypots
  country: "0-1/country",
  phone: "0-1/phone",
};

export async function submitForm(state: FormFields) {
  if (!formSchema.safeParse(state).success) {
    console.log("Invalid form", state);
    return state;
  }

  const fields: { objectTypeId: string; name: string; value: string }[] = [];
  Object.entries(state).forEach(([key, value]) => {
    if (key === "country" || key === "phone") {
      return;
    }
    const fieldId = FieldToIdMap[key as keyof FormFields];
    const splitId = fieldId.split("/");
    fields.push({
      objectTypeId: splitId[0],
      name: splitId[1],
      value: value,
    });
  });

  const response = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
    {
      method: "POST",
      body: JSON.stringify({ fields }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (response.ok) {
    console.log("Form submitted successfully");
  } else {
    console.log(await response.text());
    throw new Error("Failed to submit form");
  }
}
