const prices = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Under $20",
    value: "20",
  },
  {
    label: "$20 - $50",
    value: "50",
  },
  {
    label: "$50 - $100",
    value: "100",
  },
  {
    label: "Above $100",
    value: "101",
  },
];

const PriceFilter = ({
  selectedPrice,
  onSelectPrice,
}) => {
  return (
    <div className="flex flex-wrap gap-3 my-8">

      {prices.map((price) => (

        <button
          key={price.value}
          onClick={() => onSelectPrice(price.value)}
          className={`px-5 py-3 rounded-full border transition

          ${
            selectedPrice === price.value
              ? "bg-green-600 text-white border-green-600"
              : "bg-white hover:bg-gray-100"
          }`}
        >

          {price.label}

        </button>

      ))}

    </div>
  );
};

export default PriceFilter;