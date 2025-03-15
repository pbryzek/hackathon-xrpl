const BACKEND_URL = import.meta.env.VITE_BACKEND_DOMAIN;

export const signIn = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/create-signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Sign-in response:", data);
      return data;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
};
