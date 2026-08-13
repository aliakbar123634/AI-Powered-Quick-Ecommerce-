const CategoryPagination = ({
    page,
    setPage,
    nextPage,
    previousPage,
}) => {

    return (

        <div className="flex justify-center items-center gap-5 mt-14">

            <button
                disabled={!previousPage}
                onClick={() => setPage(page - 1)}
                className={`px-5 py-2 rounded-xl border

                ${
                    previousPage
                        ? "hover:bg-gray-100"
                        : "opacity-50 cursor-not-allowed"
                }`}
            >
                Previous
            </button>

            <span className="font-bold text-lg">
                Page {page}
            </span>

            <button
                disabled={!nextPage}
                onClick={() => setPage(page + 1)}
                className={`px-5 py-2 rounded-xl border

                ${
                    nextPage
                        ? "hover:bg-gray-100"
                        : "opacity-50 cursor-not-allowed"
                }`}
            >
                Next
            </button>

        </div>

    );

};

export default CategoryPagination;