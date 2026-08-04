import { CURRENCIES, CURRENCY_META, type CurrencyCode } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CurrencySelect({
  value,
  onChange,
  disabled,
  className,
  ariaLabel = "Preferred currency",
}: {
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as CurrencyCode)}
      disabled={disabled ?? false}
    >
      <SelectTrigger className={className} aria-label={ariaLabel}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((code) => (
          <SelectItem key={code} value={code}>
            {CURRENCY_META[code].symbol} {code} · {CURRENCY_META[code].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}