const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjgaepob";

type FormspreePayload = Record<string, string | number | boolean | null | string[]>;

export async function submitToFormspree(payload: FormspreePayload) {
  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    return;
  }

  let message = "Unable to submit right now. Please try again.";

  try {
    const data = (await response.json()) as {
      errors?: Array<{ message?: string }>;
    };
    if (data.errors?.length) {
      message = data.errors
        .map((error) => error.message)
        .filter(Boolean)
        .join(", ");
    }
  } catch {
    // Fall back to the generic message if Formspree returns a non-JSON body.
  }

  throw new Error(message);
}
