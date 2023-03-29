import { render, screen } from '@testing-library/react'
import { test } from 'vitest'
import { Login } from '~/components/login/Login'

test('renders login page without crashing', () => {
  render(<Login />)
  const loginButton = screen.getByText(/Log in/i)
  expect(loginButton).toBeInTheDocument()
})
