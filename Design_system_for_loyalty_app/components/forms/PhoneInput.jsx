import React from 'react';
import { Input } from './Input.jsx';

const fmt = (raw) => {
  const d = raw.replace(/\D/g, '').slice(0, 10);
  return d.length > 5 ? d.slice(0, 5) + ' ' + d.slice(5) : d;
};

export function PhoneInput({ value = '', onChange, label = 'Phone number', error, hint, dialCode = '+91' }) {
  return (
    <Input
      label={label} prefix={dialCode} mono icon="phone" type="tel"
      placeholder="98765 43210" value={fmt(value)} error={error}
      hint={hint || 'Your card lives on this number. No app, no password.'}
      onChange={(v) => onChange && onChange(v.replace(/\D/g, '').slice(0, 10))}
    />
  );
}
