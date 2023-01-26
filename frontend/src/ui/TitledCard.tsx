import React from "react";

const TitledCard = ({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="rounded-lg border p-3 shadow-sm duration-200 hover:shadow-md w-full">
    <header className="px-2 pb-4 flex items-center justify-between">
      <p className="text-xl font-bold text-gray-900">{title}</p>
      {actions}
    </header>
    {children}
  </div>
);

export default TitledCard;
