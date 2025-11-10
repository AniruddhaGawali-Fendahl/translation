import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";

export default function LocaleSwitcher() {
  const t = useTranslations();
  const locale = useLocale();
  const lang = ["en", "es", "fr"];

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={locale}>
      {lang.map((cur) => (
        <option key={cur} value={cur}>
          {cur.toUpperCase()}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}
