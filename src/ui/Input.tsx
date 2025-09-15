import '../styles/input.css';
import type { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string; };

export default function Input({ label, error, id, ...rest }: Props){
  const inputId = id || rest.name || undefined;
  return (
    <label className="in" htmlFor={inputId}>
      {label && <span>{label}</span>}
      <input id={inputId} {...rest} />
      {error && <span className="error" role="alert">{error}</span>}
    </label>
  );
}
