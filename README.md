<h1 align="center">Astro Typesafe Routes</h1>
<p align="center">
  Enhance your Astro development experience with rigorous type safety for every route in your application. This integration automatically generates TypeScript definitions from your project's route structure.
  <br />
  <br />
  <a href="https://badge.fury.io/js/astro-typesafe-routes"><img src="https://badge.fury.io/js/astro-typesafe-routes.svg?icon=si%3Anpm" alt="npm version" height="18"></a>
</p>

<div align="center">
  <img src="https://i.ibb.co/g3k4NfN/ezgif-4-b7d48fa603.gif" alt="Usage demo">
</div>

---
## Requirements
Works with Astro version 4 and 5, with a minimum of `4.14.0`.

## Installation
1. Add integration:
```bash
npx astro add astro-typesafe-routes
```
2. Start the Astro development server if it's not already running to run type generation:
```bash
npm run dev
```

## Manual Installation
1. Install package:
```sh
npm install -D astro-typesafe-routes
```
2. Add integration to `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';
import astroTypesafeRoutes from "astro-typesafe-routes"

export default defineConfig({
  integrations: [
    astroTypesafeRoutes()
  ]
});
```
3. Start the Astro development server if it's not already running to run code generation:
```bash
npm run dev
```


## Usage
Import the `Link` component and use it as a drop-in replacement for links.
```typescript
---
import Link from "astro-typesafe-routes/link";
---

<Link to="/blog/[id]" params={{ id: "4" }}>Blog post</Link>
```

If you can't or don't want to use the `Link` component, you can use the `$path` function to ensure safe URLs.
```typescript
---
import { $path } from "astro-typesafe-routes";
---

<a href={$path("/blog/[id]", { params: { id: "4" } })}>
  Blog Post
</a>
```

Both the `$path` function and `Link` component also accepts the optional fields `search`, `hash` and `trailingSlash`.

```typescript
---
import Link from "astro-typesafe-routes/link";
---

<Link
  to="/blog/[id]"
  params={{ id: "4" }}
  hash="header"
  search={{ filter: "recent" }}
>
  Slug here
</Link>
```

## Typed Custom Component Props
Import `Route` and `RouteOptions` types to add type safety to your custom link components:

```typescript
---
import { HTMLAttributes } from "astro/types";
import { $path, type RouteOptions } from "../index";

export type Props = Omit<HTMLAttributes<"a">, "href"> & RouteOptions;

const { to, params, search, hash, trailingSlash, ...anchorProps } = Astro.props;
const href = $path({ to, params, search, hash, trailingSlash });
---

<a href={href} {...anchorProps}>
  <slot />
</a>
```

## Credit
Inspiration taken from [yesmeck/remix-routes](https://github.com/yesmeck/remix-routes).
