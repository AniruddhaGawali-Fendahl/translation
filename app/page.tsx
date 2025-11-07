"use client";

import MUITypography from "@/components/Typography";
import { Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <MUITypography variant="h1" component="h2" i18nKey="title">
        h1. Heading
      </MUITypography>
      <MUITypography variant="h3" component="h2" i18nKey="sub-title">
        this is a sub title
      </MUITypography>
      {/* <h1>
        <Trans i18nKey={"title"}>h1. Heading</Trans>
      </h1> */}
    </div>
  );
}
