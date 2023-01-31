import React from "react";

const TitledCard = ({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="w-full rounded-lg border p-3 shadow-sm duration-200 hover:shadow-md">
    <header className="flex flex-col px-2 pb-4">
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold text-gray-900">{title}</p>
        {actions}
      </div>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </header>
    {children}
  </div>
);

export default TitledCard;
