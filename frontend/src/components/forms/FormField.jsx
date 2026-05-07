const FormField = ({ label, error, children }) => (
  <label className="form-field">
    <span>{label}</span>
    {children}
    {error ? <small className="form-error">{error}</small> : null}
  </label>
);

export default FormField;
