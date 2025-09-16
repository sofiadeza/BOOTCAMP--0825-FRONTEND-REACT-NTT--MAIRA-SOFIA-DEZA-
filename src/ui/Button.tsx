import '../styles/button.css';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type Props = PropsWithChildren<{ variant?: 'primary'|'ghost'|'danger'; full?: boolean; className?: string; }> & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, variant='primary', full=false, className='', ...rest }: Props){
  const cls = ['btn', variant, full? 'full' : '', className].filter(Boolean).join(' ');
  return <button className={cls} {...rest}>{children}</button>;
}
