import { render, screen, waitFor } from '@testing-library/react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '../ProtectedRoute'

// Mock AuthContext
jest.mock('@/contexts/AuthContext')
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

// Mock router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when loading', () => {
    it('should show loading spinner', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        userProfile: null,
        loading: true,
        signOut: jest.fn(),
        refreshUserProfile: jest.fn(),
      })

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      expect(screen.getByText(/loading/i)).toBeInTheDocument()
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })
  })

  describe('when not authenticated', () => {
    it('should redirect to sign-in', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        userProfile: null,
        loading: false,
        signOut: jest.fn(),
        refreshUserProfile: jest.fn(),
      })

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/sign-in')
      })

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })
  })

  describe('when authenticated without profile', () => {
    it('should render children when profile is still loading', () => {
      mockUseAuth.mockReturnValue({
        user: { uid: 'test-uid' } as any,
        userProfile: null,
        loading: false,
        signOut: jest.fn(),
        refreshUserProfile: jest.fn(),
      })

      render(
        <ProtectedRoute allowedRoles={['coach']}>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      // Component renders children when user exists but profile is null (profile still loading)
      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })
  })

  describe('when authenticated with correct role', () => {
    it('should render children for coach', () => {
      mockUseAuth.mockReturnValue({
        user: { uid: 'test-uid' } as any,
        userProfile: { uid: 'test-uid', role: 'coach' } as any,
        loading: false,
        signOut: jest.fn(),
        refreshUserProfile: jest.fn(),
      })

      render(
        <ProtectedRoute allowedRoles={['coach']}>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })

    it('should render children for coachee', () => {
      mockUseAuth.mockReturnValue({
        user: { uid: 'test-uid' } as any,
        userProfile: { uid: 'test-uid', role: 'coachee' } as any,
        loading: false,
        signOut: jest.fn(),
        refreshUserProfile: jest.fn(),
      })

      render(
        <ProtectedRoute allowedRoles={['coachee']}>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })
  })

  describe('when authenticated with wrong role', () => {
    it('should redirect coach to their dashboard when accessing coachee-only route', async () => {
      mockUseAuth.mockReturnValue({
        user: { uid: 'test-uid' } as any,
        userProfile: { uid: 'test-uid', role: 'coach' } as any,
        loading: false,
        signOut: jest.fn(),
        refreshUserProfile: jest.fn(),
      })

      render(
        <ProtectedRoute allowedRoles={['coachee']}>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        // Coach gets redirected to /coach dashboard
        expect(mockPush).toHaveBeenCalledWith('/coach')
      })
    })
  })

  describe('when no role restrictions', () => {
    it('should render for any authenticated user', () => {
      mockUseAuth.mockReturnValue({
        user: { uid: 'test-uid' } as any,
        userProfile: { uid: 'test-uid', role: 'coach' } as any,
        loading: false,
        signOut: jest.fn(),
        refreshUserProfile: jest.fn(),
      })

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      expect(screen.getByText('Protected Content')).toBeInTheDocument()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })
})
