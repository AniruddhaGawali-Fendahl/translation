import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";
import { LOCALES } from "@/i18n/constants";

export default function LocaleSwitcher() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={locale}>
      {LOCALES.map((cur) => (
        <option key={cur} value={cur}>
          {cur.toUpperCase()}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}
