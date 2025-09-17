import React, { Suspense } from "react";
import LoginPage from "./LoginPage";

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center ">
          Loading...
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
};

export default Page;
