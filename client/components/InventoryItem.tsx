import ItemProps from "@/data/item-props";

const InventoryItem = ({ item }: { item: ItemProps }) => {
  return (
    <div className="border rounded-lg shadow p-4 bg-white relative">
      <h2 className="text-lg font-semibold">{item.name}</h2>
      <p className="text-sm text-gray-600">{item.location}</p>
      <div className="text-sm text-gray-600">
        <div>Current Level: {item.quantity}</div>
        <div>Min Level: {item.min_quantity}</div>
      </div>
    </div>
  );
};
export default InventoryItem;
