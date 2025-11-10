import React from "react";
import type { TypographyProps } from "@mui/material/Typography";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import { autoKeyFromText } from "@/lib/autokey";

export interface MUITypographyProps extends Omit<TypographyProps, "translate"> {
  type?: "text" | "number" | "currency";
  i18nKey?: string;
  translate?: boolean;
}

const formatNumber = (
  number: number,
  type: "number" | "currency",
  maximumFractionDigits = 4,
  country = "en-IN",
  currency = "INR"
): string => {
  const hasDecimal = `${number}`.includes(".");
  const fractionOptions = hasDecimal
    ? { maximumFractionDigits }
    : { maximumFractionDigits: 0 };

  const options: Intl.NumberFormatOptions =
    type === "currency"
      ? {
          style: "currency",
          currency,
          ...fractionOptions,
        }
      : {
          ...fractionOptions,
        };

  return new Intl.NumberFormat(country, options).format(number);
};

const MUITypography: React.FC<MUITypographyProps> = ({
  type = "text",
  i18nKey,
  children,
  translate = true,
  ...rest
}) => {
  const t = useTranslations();
  const finalStyle: React.CSSProperties = {
    cursor: rest?.onClick ? "pointer" : "default",
    ...(rest?.style || {}),
  };

  const rawText =
    type === "text"
      ? String(children ?? "")
      : formatNumber(children as number, type);

  if (!translate) {
    return (
      <Typography {...rest} style={finalStyle}>
        {rawText}
      </Typography>
    );
  }

  const key = i18nKey ?? autoKeyFromText(rawText);

  return (
    <Typography {...rest} style={finalStyle}>
      {t(key, { defaultValue: rawText })}
    </Typography>
  );
};

export default MUITypography;
