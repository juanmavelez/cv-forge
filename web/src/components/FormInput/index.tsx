interface FormInputProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
    style?: React.CSSProperties;
}

export function FormInput({ label, value, onChange, type = 'text', placeholder, style }: FormInputProps) {
    return (
        <div className="form-group" style={style}>
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
