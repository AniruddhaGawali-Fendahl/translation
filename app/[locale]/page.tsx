'use client';

import LocaleSwitcher from '@/components/LocaleSwitcher';
import MUITypography from '@/components/Typography';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <LocaleSwitcher />

      <MUITypography
        variant="h1"
        component="h2"
        i18nKey="title"
      >
        h1. Heading
      </MUITypography>
      <MUITypography
        variant="h3"
        component="h2"
        i18nKey="sub-title"
      >
        this is a sub title
      </MUITypography>
      {/* <h1>
        <Trans i18nKey={"title"}>h1. Heading</Trans>
      </h1> */}
    </div>
  );
}
