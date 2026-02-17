interface FormInputProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
}

export function FormInput({ label, value, onChange, type = 'text', placeholder }: FormInputProps) {
    return (
        <div className="form-group">

            <label>{label}</label>
            <input
                className="form-input"
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );
}
