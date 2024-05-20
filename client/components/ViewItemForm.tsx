import React from "react";
import ItemProps from "@/data/item-props";
import Link from "next/link";

const ViewItemForm = ({
  item,
  onClose,
}: {
  item: ItemProps;
  onClose: () => void;
}) => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">{item.name}</h2>
      <div className="space-y-4">
        {item.description && (
          <div>
            <label className="block text-md font-bold text-gray-700">
              Description:
            </label>
            <p className="mt-1 text-sm text-gray-900">{item.description}</p>
          </div>
        )}

        <div>
          <label className="block text-md font-bold text-gray-700">
            Location:
          </label>
          <p className="mt-1 text-sm text-gray-900">{item.location}</p>
        </div>

        <div>
          <label className="block text-md font-bold text-gray-700">
            Quantity:
          </label>
          <p className="mt-1 text-sm text-gray-900">{item.quantity}</p>
        </div>

        <div>
          <label className="block text-md font-bold text-gray-700">
            Minimum Quantity:
          </label>
          <p className="mt-1 text-sm text-gray-900">{item.min_quantity}</p>
        </div>

        <div>
          <label className="block text-md font-bold text-gray-700">
            Tags:
          </label>
          <p className="mt-1 text-sm text-gray-900">{item.tags}</p>
        </div>

        {item.links && item.links.length > 0 && (
          <div>
            <label className="block text-md font-bold text-gray-700">
              Where to Buy:
            </label>
            <ul className="list-disc list-inside mt-1 text-sm text-gray-900">
              {item.links.map((link, index) => (
                <li key={index}>
                  <Link href={link} className="text-blue-500 underline" target="_blank">
                      {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewItemForm;
