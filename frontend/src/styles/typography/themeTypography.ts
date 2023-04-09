import { TypographyScale, TypographyTokens } from './types'

/**
 * M3 typography tokens for display typography. See:
 * https://m3.material.io/styles/typography/type-scale-tokens#40fc37f8-3269-4aa3-9f28-c6113079ac5d
 */
const display: TypographyScale = {
  large: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '57px',
    lineHeight: '64px',
    letterSpacing: '-0.25px',
  },
  medium: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '45px',
    lineHeight: '52px',
    letterSpacing: '0px',
  },
  small: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '36px',
    lineHeight: '44px',
    letterSpacing: '0px',
  },
}

/**
 * M3 typography tokens for headlines typography. See:
 * https://m3.material.io/styles/typography/type-scale-tokens#40fc37f8-3269-4aa3-9f28-c6113079ac5d
 */
const headline: TypographyScale = {
  large: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '32px',
    lineHeight: '40px',
    letterSpacing: '0px',
  },
  medium: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '28px',
    lineHeight: '36px',
    letterSpacing: '0px',
  },
  small: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '24px',
    lineHeight: '32px',
    letterSpacing: '0px',
  },
}

/**
 * M3 typography tokens for body typography. See:
 * https://m3.material.io/styles/typography/type-scale-tokens#40fc37f8-3269-4aa3-9f28-c6113079ac5d
 */
const body: TypographyScale = {
  large: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0.5px',
  },
  medium: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.25px',
  },
  small: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.4px',
  },
}

/**
 * M3 typography tokens for label typography. See:
 * https://m3.material.io/styles/typography/type-scale-tokens#40fc37f8-3269-4aa3-9f28-c6113079ac5d
 */
const label: TypographyScale = {
  large: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.1px',
  },
  medium: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.5px',
  },
  small: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: '11px',
    lineHeight: '16px',
    letterSpacing: '0.5px',
  },
}

/**
 * M3 typography tokens for title typography. See:
 * https://m3.material.io/styles/typography/type-scale-tokens#40fc37f8-3269-4aa3-9f28-c6113079ac5d
 */
const title: TypographyScale = {
  large: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '22px',
    lineHeight: '28px',
    letterSpacing: '0px',
  },
  medium: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0.15px',
  },
  small: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.1px',
  },
}

/**
 * M3 typography theme. Exported from https://m3.material.io/theme-builder#/custom
 */
export const typographyTheme: TypographyTokens = {
  displayLarge: display.large,
  displayMedium: display.medium,
  displaySmall: display.small,
  headlineLarge: headline.large,
  headlineMedium: headline.medium,
  headlineSmall: headline.small,
  titleLarge: title.large,
  titleMedium: title.medium,
  titleSmall: title.small,
  labelLarge: label.large,
  labelMedium: label.medium,
  labelSmall: label.small,
  bodyLarge: body.large,
  bodyMedium: body.medium,
  bodySmall: body.small,
}
