import { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { PortfolioData } from "../types";

interface UseFetchOffersProps {
  mobileNumber: string;
  sessionId: string;
}

export function useFetchOffers({
  mobileNumber,
  sessionId,
}: UseFetchOffersProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      setIsLoading(true);
      try {
        const sdkCredentials = sessionStorage.getItem("sdkCredentials");
        if (!sdkCredentials) {
          throw new Error("Session expired. Please refresh the page.");
        }
        const { apiKey, apiSecret, sessionId } = JSON.parse(sdkCredentials);

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/loan-sdk/get-offers`,
          {
            phone: `+91${mobileNumber}`,
            sessionId: sessionId,
          },
          {
            headers: {
              "X-SDK-Key": apiKey,
              "X-SDK-Secret": apiSecret,
            },
          }
        );

        setPortfolioData(response.data);
      } catch (error) {
        console.error("Error fetching offers:", error);
        enqueueSnackbar("Failed to load offers. Please try again.", {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, [mobileNumber, sessionId]);

  return { portfolioData, isLoading };
}
