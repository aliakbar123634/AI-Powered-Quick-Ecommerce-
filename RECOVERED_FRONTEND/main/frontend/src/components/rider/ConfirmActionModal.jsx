const ConfirmActionModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl p-8 w-[420px] shadow-2xl">

        <h2 className="text-2xl font-bold">
          {title}
        </h2>

        <p className="text-gray-500 mt-3">
          {message}
        </p>

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-xl border"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white"
          >
            Confirm
          </button>

        </div>

      </div>

    </div>
  );
};

export default ConfirmActionModal;