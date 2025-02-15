export const getF = async (endpoint: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}${endpoint}`);

  if (!response.ok) {
    console.log("response", response);

    return undefined;
  }
  return response.json();
};
