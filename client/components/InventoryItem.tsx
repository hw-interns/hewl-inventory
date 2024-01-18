import Image from "next/image";

interface ItemProps {
  item: {
    id: string;
    name: string;
    imageName: string;
    imageUrl: string;
    units: number;
    location: string;
    minQuantity: number;
    lastUpdated: string;
  };
}

const InventoryItem = ({ item }: ItemProps) => {
  return (
    <div className="px-16">
      <div className="flex flex-col p-4 border-b-2 bg-white shadow rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* <div className="p-1 mr-4 bg-gray-100 rounded">
            <Image src={item.imageUrl} alt={item.name} width={50} height={50} />
          </div> */}
            <div>
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-600">
                {item.units} units | {item.location}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Min Level: {item.minQuantity}
            </div>
            <div className="text-sm text-gray-400">
              Last updated: {item.lastUpdated}
            </div>
            <a href="#" className="text-indigo-600 hover:underline">
              Link to purchase
            </a>
          </div>
        </div>
        <div className="flex mt-4">
          <input
            className="flex-1 border p-2 mr-2 rounded text-gray-700"
            placeholder="Enter your name"
          />
          <input
            className="flex-1 border p-2 mr-2 rounded text-gray-700"
            type="number"
            placeholder="Enter quantity change"
          />
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryItem;
