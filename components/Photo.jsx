import Image from "next/image";

/**
 * Photo qui remplit son conteneur (.frame) : équivalent de l'ancien
 * `background-size: cover`, mais via next/image (WebP, tailles adaptées,
 * chargement différé). `position` règle le cadrage (object-position, ex. "50% 20%"
 * pour garder le haut de l'image quand elle est recadrée). `sizes` décrit la largeur affichée pour que le navigateur
 * choisisse la bonne variante ; `alt` vide = image décorative. `style` permet de recaler l'image (ex. transform).
 */
export default function Photo({ src, alt = "", sizes, preload = false, loading, className, position, style, onLoad, onError }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      loading={loading}
      className={className}
      onLoad={onLoad}
      onError={onError}
      style={position || style ? { ...(position ? { objectPosition: position } : null), ...style } : undefined}
      draggable={false}
    />
  );
}
