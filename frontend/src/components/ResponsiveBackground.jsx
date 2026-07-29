/**
 * ResponsiveBackground
 * -------------------------------------------------------------
 * Drop-in replacement for `style={{ backgroundImage: "url(...)" }}`.
 * Pass a portrait image (our default export) and, once it exists,
 * a landscape crop of the same scene -- the CSS in tokens.css
 * (`.bg-responsive`) takes care of picking the right one at the
 * right viewport via a media query, so there's no JS/flicker cost.
 *
 * If `landscape` is omitted, it just falls back to `portrait`
 * everywhere, so pages keep working before their wide art lands.
 *
 * Usage:
 *   <ResponsiveBackground
 *     as="main"
 *     portrait="/images/home-bg.jpg"
 *     landscape="/images/home-bg-landscape.jpg"
 *     className="relative flex min-h-[100dvh] ..."
 *   >
 *     ...page content...
 *   </ResponsiveBackground>
 */
export default function ResponsiveBackground({
  as: Component = "div",
  portrait,
  landscape,
  className = "",
  style = {},
  children,
  ...rest
}) {
  return (
    <Component
      className={`bg-responsive bg-cover bg-center ${className}`}
      style={{
        "--bg-portrait": `url('${portrait}')`,
        "--bg-landscape": `url('${landscape ?? portrait}')`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
