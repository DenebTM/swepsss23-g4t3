import { render } from '@testing-library/react'
import { test } from 'vitest'
import { PhotoUpload } from '~/components/greenhouses/upload/PhotoUpload'

test('render PhotoUpload without crashing', async () => {
  render(<PhotoUpload />)
})
