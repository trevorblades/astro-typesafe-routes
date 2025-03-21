export type RouteFile = { absolutePath: string };

export type RouteFileWithSearch = RouteFile & {
  hasSearchSchema: boolean;
};

export type ResolvedRoute = RouteFileWithSearch & {
  path: string;
  params: string[] | null;
};

export type RequiredAstroConfig = {
  rootDir: string;
  buildOutput: "static" | "server";
};
