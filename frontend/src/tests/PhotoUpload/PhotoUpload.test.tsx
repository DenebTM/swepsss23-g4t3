import { render } from '@testing-library/react'
import { test } from 'vitest'
import { PhotoUpload } from '~/components/photoUpload/PhotoUpload'

test('renders photo upload page without crashing', () => {
  render(<PhotoUpload />)
})
