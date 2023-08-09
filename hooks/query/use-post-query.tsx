"use client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useLoginToast } from "@/hooks/useLoginToast";
import { useRouter } from "next/navigation";

interface UsePostQueryProps {
  query: string;
  onSuccessMessage?: string;
  onSuccessDescription?: string;
  auth?: boolean;
  onErrorMessage?: string;
  onErrorDescription?: string;
}

const UsePostQuery = ({
  query,
  onErrorMessage,
  onSuccessDescription,
  auth = true,
  onSuccessMessage,
  onErrorDescription,
}: UsePostQueryProps) => {
  const { loginToast } = useLoginToast();
  const router = useRouter();
  return useMutation({
    mutationFn: async (payload: object) => {
      const { data } = await axios.post(query, payload);
      await router.refresh();
      return data;
    },
    onSuccess: async () => {
      return toast({
        title: onSuccessMessage,
        description: onSuccessDescription,
        variant: "default",
      });
    },
    onError: (error) => {
      if (auth) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) return loginToast();
          if (error.response?.status === 409)
            return toast({
              title: onErrorMessage,
              description: onErrorDescription,
              variant: "destructive",
            });
        }
      }
      return toast({
        title: "ops... some thing want wrong",
        description: "please try later",
        variant: "destructive",
      });
    },
  });
};
export default UsePostQuery;
