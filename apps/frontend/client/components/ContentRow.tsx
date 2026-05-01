import React from "react";

type Props = {
  title: string;
  items: any[];
};

export default function ContentRow({ title, items }: Props) {
  return (
    <section className="px-6 py-4">
      <h2 className="text-white text-xl font-bold mb-4">{title}</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items?.map((item: any, index: number) => (
          <div key={index} className="bg-zinc-800 p-4 rounded-lg text-white">
            {item.title || "Course"}
          </div>
        ))}
      </div>
    </section>
  );
}
