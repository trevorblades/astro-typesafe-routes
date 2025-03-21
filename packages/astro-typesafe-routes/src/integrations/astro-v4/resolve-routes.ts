import * as path from "node:path";
import fastGlob from "fast-glob";
import { doesRouteHaveSearchSchema } from "../common/search-params.js";
import type {
  RequiredAstroConfig,
  ResolvedRoute,
  RouteFile,
  RouteFileWithSearch,
} from "../common/types";
import { normalizeSeparators } from "../common/utils.js";

const PAGES_PATTERN = "src/pages/**/*.{astro,md,mdx,html}";

async function listAstroRouteFiles(rootDir: string): Promise<RouteFile[]> {
  const routePaths = await fastGlob(PAGES_PATTERN, {
    cwd: rootDir,
    absolute: true,
  });
  return routePaths.map((routePath) => ({ absolutePath: routePath }));
}

async function getRouteSearch(
  routes: RouteFile[],
  astroConfig: RequiredAstroConfig,
): Promise<RouteFileWithSearch[]> {
  // Search params have no effect on static builds.
  const shouldResolveSearchParams = astroConfig.buildOutput === "server";

  const promises = routes.map(async (route) => {
    return {
      absolutePath: route.absolutePath,
      hasSearchSchema: shouldResolveSearchParams
        ? await doesRouteHaveSearchSchema(route.absolutePath)
        : false,
    };
  });

  return await Promise.all(promises);
}

function trimFileExtensions(value: string) {
  return value.replace(/\.([^.]+)$/, "");
}

function trimIndex(value: string) {
  return value.replace(/index$/, "");
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

function addLeadingSlash(value: string) {
  return value.startsWith("/") ? value : `/${value}`;
}

function getRouteParams(value: string) {
  return (value.match(/(\[[^\]]+\])/g) || []).map((segment) =>
    segment.replace(/\[|\]/g, ""),
  );
}

type getResolvedRoutesParams = {
  routesWithSearch: RouteFileWithSearch[];
  rootDir: string;
};

function getResolvedRoutes(args: getResolvedRoutesParams): ResolvedRoute[] {
  return args.routesWithSearch.map((route) => {
    const pagesDir = path.join(args.rootDir, "src", "pages");
    const relativePath = path.relative(pagesDir, route.absolutePath);
    const withNormalizedSeparators = normalizeSeparators(relativePath);
    const withoutExtension = trimFileExtensions(withNormalizedSeparators);
    const withoutIndex = trimIndex(withoutExtension);
    const withoutTrailingSlash = trimTrailingSlash(withoutIndex);
    const withLeadingSlash = addLeadingSlash(withoutTrailingSlash);
    const params = getRouteParams(withLeadingSlash);

    return {
      absolutePath: route.absolutePath,
      hasSearchSchema: route.hasSearchSchema,
      path: withLeadingSlash,
      params: params.length === 0 ? null : params,
    };
  });
}

export async function resolveRoutesAstroV4(
  astroConfig: RequiredAstroConfig,
): Promise<ResolvedRoute[]> {
  const routeFiles = await listAstroRouteFiles(astroConfig.rootDir);
  const routesWithSearch = await getRouteSearch(routeFiles, astroConfig);

  return getResolvedRoutes({
    routesWithSearch,
    rootDir: astroConfig.rootDir,
  });
}
