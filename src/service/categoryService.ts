import API_CONFIG from "../config/api";


export const getCategory = async (
) => {
  const response = await fetch(`${API_CONFIG.BACK_API}/categories`);

  if (!response.ok) throw new Error("Failed to fetch category.");

  return response.json();
};
