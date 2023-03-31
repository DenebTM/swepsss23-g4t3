import { render, screen } from '@testing-library/react'
import { test } from 'vitest'
import { Login } from '~/components/login/Login'

test('renders login page elements without crashing', () => {
  render(<Login />)
  expect(screen.getByText('Username')).toBeInTheDocument()
  expect(screen.getByText('Password')).toBeInTheDocument()
  expect(screen.getAllByText('Log in')).toHaveLength(2) // Expect title and button
})
