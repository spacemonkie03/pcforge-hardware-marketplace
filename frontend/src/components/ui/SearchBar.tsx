import { FormEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  className?: string;
  inputClassName?: string;
}

const SearchInput = ({
  value,
  onChange,
  placeholder,
  inputClassName,
}: Omit<SearchBarProps, 'onSubmit' | 'className'>) => (
  <div className={`pf-search ${inputClassName || ''}`.trim()}>
    <svg className="pf-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="pf-search-input"
    />
  </div>
);

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search components...',
  onSubmit,
  className = '',
  inputClassName = '',
}: SearchBarProps) => {
  if (onSubmit) {
    return (
      <form onSubmit={onSubmit} className={className}>
        <SearchInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          inputClassName={inputClassName}
        />
      </form>
    );
  }

  return (
    <div className={className}>
      <SearchInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputClassName={inputClassName}
      />
    </div>
  );
};
