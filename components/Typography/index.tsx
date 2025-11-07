import React from "react";

import type { TypographyProps } from "@mui/material/Typography";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

export interface MUITypographyProps extends TypographyProps {
  type?: "text" | "number" | "currency";
  i18nKey?: string;
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
  ...rest
}) => {
  const { t, i18n } = useTranslation();
  const finalStyle: React.CSSProperties = {
    cursor: rest?.onClick ? "pointer" : "default",
    ...(rest?.style || {}),
  };

  return (
    <Typography {...rest} style={finalStyle}>
      {i18nKey
        ? t(i18nKey, {
            defaultValue:
              type === "text"
                ? String(children)
                : formatNumber(children as number, type),
          })
        : type === "text"
        ? children
        : formatNumber(children as number, type)}
    </Typography>
  );
};

export default MUITypography;
