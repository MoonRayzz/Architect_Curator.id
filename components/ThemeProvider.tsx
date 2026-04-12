"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// PERBAIKAN: Kita gunakan React.ComponentProps agar TypeScript otomatis 
// membaca tipe data langsung dari NextThemesProvider tanpa perlu mencari folder dist/types
export function ThemeProvider({ 
  children, 
  ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}