import Modal from "./Modal.jsx";

const ConfirmDialog = ({ open, title, description, onConfirm, onClose }) => (
  <Modal open={open} title={title} onClose={onClose}>
    <p className="muted-text">{description}</p>
    <div className="form-actions">
      <button type="button" className="secondary-button" onClick={onClose}>
        Cancel
      </button>
      <button type="button" className="danger-button" onClick={onConfirm}>
        Confirm
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
