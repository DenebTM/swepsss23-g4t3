/** Details on font for a single typography instance */
interface FontDetails {
  fontFamily: string
  fontWeight: string
  fontSize: string
  letterSpacing: string
  lineHeight: string
}

/**
 * Interface for the type scale values stops defined for M3 typography:
 * https://m3.material.io/styles/typography/type-scale-tokens
 */
export interface TypographyScale {
  small: FontDetails
  medium: FontDetails
  large: FontDetails
}

/**
 * Interface for the typography tokens defined for M3 typography:
 * https://m3.material.io/styles/typography/type-scale-tokens
 */
export interface TypographyTokens {
  display: TypographyScale
  headline: TypographyScale
  title: TypographyScale
  label: TypographyScale
  body: TypographyScale
}
