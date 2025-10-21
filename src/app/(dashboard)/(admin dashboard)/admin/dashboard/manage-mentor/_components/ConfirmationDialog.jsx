const ConfirmationDialog = ({
  confirmationDialog,
  setConfirmationDialog,
  handleConfirmAction,
}) => {
  if (!confirmationDialog.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-[800px]">
        <h2 className="text-xl font-bold mb-2">{confirmationDialog.title}</h2>
        <p className="mb-6">{confirmationDialog.message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() =>
              setConfirmationDialog({
                isOpen: false,
                title: "",
                message: "",
                action: null,
                mentorId: null,
                mentorName: "",
                isActive: false,
              })
            }
            className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmAction}
            className={`px-4 py-2 text-white rounded-md transition-colors ${
              confirmationDialog.action === "delete"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-main hover:bg-main"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
