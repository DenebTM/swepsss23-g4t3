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

/** Custom typography variants for the MUI Typography component */
export type TypographyVariant =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'

/**
 * Interface for the typography tokens defined for M3 typography:
 * https://m3.material.io/styles/typography/type-scale-tokens
 */
export type TypographyTokens = Record<TypographyVariant, FontDetails>
