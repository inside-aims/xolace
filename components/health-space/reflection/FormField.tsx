import {FormFieldProps} from "@/components/health-space/reflection/index";

const FormField = ({id, label, type = "text", value, onChange, placeholder, as = "input", options = [], labelDescription}: FormFieldProps) => (
  <div className="w-full flex flex-col">
    <label htmlFor={id} className={""}>{label} {labelDescription && <span className="text-sm text-muted-foreground">({labelDescription})</span>}</label>
    {as === "textarea" ? (
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={"border rounded-md py-2 px-4"}
      />
    ) : as === "select" ? (
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={"border rounded-md py-2 px-4"}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={"border rounded-md py-2 px-4"}
      />
    )}
  </div>
);

export default FormField;
