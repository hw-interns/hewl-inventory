import ItemProps from "@/data/item-props";

interface InventoryItemProps {
  item: ItemProps;
  onEdit: () => void;
  onTagClick: (tag: string) => void;
  canEdit: boolean;
}

const InventoryItem = ({
  item,
  onEdit,
  onTagClick,
  canEdit,
}: InventoryItemProps) => {
  return (
    <div className="border rounded-lg shadow p-4 bg-white relative">
      <h2 className="text-lg font-semibold mr-6">{item.name}</h2>
      <p className="text-sm text-gray-600">
        Location: {item.location ? item.location : "Unknown"}
      </p>
      <div className="text-sm text-gray-600 mb-2">
        <div>Current Level: {item.quantity}</div>
        <div>Min Level: {item.min_quantity}</div>
      </div>
      {item.tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {(typeof item.tags === "string"
            ? item.tags.split(";")
            : item.tags
          ).map((tag, index) => (
            <span
              key={index}
              onClick={() => onTagClick(tag)}
              className="cursor-pointer bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-gray-600">No Tags</div>
      )}
      {canEdit && (
        <button
          onClick={onEdit}
          className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default InventoryItem;
