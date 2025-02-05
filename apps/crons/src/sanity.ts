import { createClient } from "@sanity/client";

export const createSanity = ({
  token,
  projectId,
  dataset = "production",
}: {
  token: string;
  dataset?: string;
  projectId: string;
}) => {
  return createClient({
    dataset,
    token,
    projectId,
    apiVersion: "v2022-03-07",
  });
};
