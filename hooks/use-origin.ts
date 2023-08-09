import { useEffect, useState } from "react";

interface UseOriginProps {}

const UseOrigin = () => {
  const [mount, setMount] = useState(false);
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";
  useEffect(() => {
    setMount(true);
  }, []);
  if (!mount) return null;
  return origin;
};
export default UseOrigin;
