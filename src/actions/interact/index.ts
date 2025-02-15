export const getF = async <T>(endpoint: string): Promise<T | any> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}${endpoint}`
    );

    if (!response.ok) {
      console.log("response", response);

      return undefined;
    }
    return await response.json();
  } catch (error) {
    console.log({ error });
  }
};
