import React from "react";

interface ErrorPageProps {
  children: React.ReactNode;
}

const ErrorPage = ({ children }: ErrorPageProps) => {
  return (
    <div>{children}</div>
  )
}

export default ErrorPage;