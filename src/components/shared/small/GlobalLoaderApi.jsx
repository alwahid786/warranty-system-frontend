import { useSelector } from "react-redux";

// Use SKIP_GLOBAL_LOADER_ENDPOINTS for endpoints where a global loader would be disruptive.
const SKIP_GLOBAL_LOADER_ENDPOINTS = new Set(["sendMessage"]);

const GlobalAPILoader = () => {
  const isAnyTaskBlocking = useSelector((state) => {
    let hasBlocking = false;

    Object.values(state).forEach((slice) => {
      if (!slice?.queries && !slice?.mutations) return;

      ["queries", "mutations"].forEach((type) => {
        const collection = slice?.[type];

        if (!collection) return;

        Object.entries(collection).forEach(([key, q]) => {
          if (q?.status === "pending") {
            const endpoint = key.split("(")[0];

            if (SKIP_GLOBAL_LOADER_ENDPOINTS.has(endpoint)) return;

            // Mutations are always blocking. Queries block only on first load.
            if (type === "mutations") {
              hasBlocking = true;

              return;
            }

            const isFirstLoad =
              q?.fulfilledTimeStamp == null && q?.data == null;

            if (isFirstLoad) {
              hasBlocking = true;
            }
          }
        });
      });
    });

    return hasBlocking;
  });

  if (!isAnyTaskBlocking) return null;

  return (
    <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-[9999] backdrop-blur-[1px]">
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-[#043655]"></div>
    </div>
  );
};

export default GlobalAPILoader;
