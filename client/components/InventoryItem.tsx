import ItemProps from "@/data/item-props";

interface InventoryItemProps {
  item: ItemProps;
  onEdit: () => void;
  canEdit: boolean;
}

const InventoryItem = ({ item, onEdit, canEdit }: InventoryItemProps) => {
  return (
    <div className="border rounded-lg shadow p-4 bg-white relative">
      <h2 className="text-lg font-semibold mr-6">{item.name}</h2>
      <p className="text-sm text-gray-600">
        Location: {item.location ? item.location : "Unknown"}
      </p>
      <div className="text-sm text-gray-600">
        <div>Current Level: {item.quantity}</div>
        <div>Min Level: {item.min_quantity}</div>
      </div>
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
