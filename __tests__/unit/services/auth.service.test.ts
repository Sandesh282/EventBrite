/**
 * __tests__/unit/services/auth.service.test.ts
 *
 * Unit tests for lib/services/auth.service.ts
 *
 * Repository and JWT modules mocked — no DB, no real tokens.
 * Tests cover credential validation logic, error mapping,
 * and the timing-attack prevention pattern in login().
 */

import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest"
import * as authService from "@/lib/services/auth.service"

// Mock DB before any repo imports — prevents neon() from running at module load
vi.mock("@/db", () => ({ db: {}, dbPool: {} }))

vi.mock("@/lib/repositories/users.repo")
vi.mock("@/lib/auth/password")
vi.mock("@/lib/auth/jwt")

import * as usersRepo  from "@/lib/repositories/users.repo"
import * as password   from "@/lib/auth/password"
import * as jwt        from "@/lib/auth/jwt"

const MOCK_USER = {
  id:           1,
  email:        "test@example.com",
  name:         "Test User",
  passwordHash: "$2b$12$hashedpassword",
  role:         "attendee",
  createdAt:    new Date(),
}

beforeAll(() => {
  process.env.JWT_SECRET         = "test-secret-32-chars-minimum-here"
  process.env.JWT_REFRESH_SECRET = "test-refresh-secret-32-chars-min"
})

beforeEach(() => {
  vi.clearAllMocks()
  // Default mock implementations
  vi.mocked(jwt.signAccessToken).mockResolvedValue("mock-access-token")
  vi.mocked(jwt.signRefreshToken).mockResolvedValue("mock-refresh-token")
})

// ---------------------------------------------------------------------------
// register()
// ---------------------------------------------------------------------------
describe("auth.service.register", () => {
  it("hashes the password before storing (never stores plaintext)", async () => {
    vi.mocked(password.hashPassword).mockResolvedValue("hashed-pw")
    vi.mocked(usersRepo.create).mockResolvedValue(MOCK_USER as any)

    await authService.register({
      email: "new@example.com", name: "New", password: "plaintext123"
    })

    expect(password.hashPassword).toHaveBeenCalledWith("plaintext123")
    // Ensure plaintext is not passed to usersRepo.create
    const createCall = vi.mocked(usersRepo.create).mock.calls[0][0]
    expect(createCall).not.toHaveProperty("password")
    expect(createCall.passwordHash).toBe("hashed-pw")
  })

  it("returns accessToken and refreshToken on success", async () => {
    vi.mocked(password.hashPassword).mockResolvedValue("hashed")
    vi.mocked(usersRepo.create).mockResolvedValue(MOCK_USER as any)

    const result = await authService.register({
      email: "new@example.com", name: "New", password: "password123"
    })

    expect(result.accessToken).toBe("mock-access-token")
    expect(result.refreshToken).toBe("mock-refresh-token")
  })

  it("returns user profile without passwordHash", async () => {
    vi.mocked(password.hashPassword).mockResolvedValue("hashed")
    vi.mocked(usersRepo.create).mockResolvedValue(MOCK_USER as any)

    const result = await authService.register({
      email: "new@example.com", name: "New", password: "password123"
    })

    expect(result.user).not.toHaveProperty("passwordHash")
    expect(result.user.email).toBe("test@example.com")
  })

  it("throws EmailAlreadyExistsError on Postgres 23505", async () => {
    vi.mocked(password.hashPassword).mockResolvedValue("hashed")
    vi.mocked(usersRepo.create).mockRejectedValue({ code: "23505" })

    await expect(
      authService.register({ email: "dup@example.com", name: "Dup", password: "pw123456" })
    ).rejects.toThrow(authService.EmailAlreadyExistsError)
  })
})

// ---------------------------------------------------------------------------
// login()
// ---------------------------------------------------------------------------
describe("auth.service.login", () => {
  it("returns tokens on valid credentials", async () => {
    vi.mocked(usersRepo.findByEmail).mockResolvedValue(MOCK_USER as any)
    vi.mocked(password.verifyPassword).mockResolvedValue(true)

    const result = await authService.login({
      email: "test@example.com", password: "correct-pw"
    })

    expect(result.accessToken).toBe("mock-access-token")
    expect(result.refreshToken).toBe("mock-refresh-token")
  })

  it("throws InvalidCredentialsError for wrong password", async () => {
    vi.mocked(usersRepo.findByEmail).mockResolvedValue(MOCK_USER as any)
    vi.mocked(password.verifyPassword).mockResolvedValue(false)

    await expect(
      authService.login({ email: "test@example.com", password: "wrong" })
    ).rejects.toThrow(authService.InvalidCredentialsError)
  })

  it("throws InvalidCredentialsError for unknown email (not UserNotFound)", async () => {
    // IMPORTANT: the error type must be the same as wrong password.
    // Returning a different error for unknown email would reveal whether
    // the email is registered — user enumeration vulnerability.
    vi.mocked(usersRepo.findByEmail).mockResolvedValue(null)
    vi.mocked(password.verifyPassword).mockResolvedValue(false) // runs on dummy hash

    await expect(
      authService.login({ email: "nobody@example.com", password: "pw" })
    ).rejects.toThrow(authService.InvalidCredentialsError)
  })

  it("still calls verifyPassword even when user is null (timing attack prevention)", async () => {
    // If we returned early when user is null (without calling verifyPassword),
    // an attacker could detect registered emails by measuring response time:
    // - Unknown email: returns fast (no bcrypt)
    // - Known email:   returns slow (bcrypt comparison)
    // This test ensures verifyPassword is ALWAYS called.
    vi.mocked(usersRepo.findByEmail).mockResolvedValue(null)
    vi.mocked(password.verifyPassword).mockResolvedValue(false)

    await expect(
      authService.login({ email: "nobody@example.com", password: "pw" })
    ).rejects.toThrow()

    // verifyPassword must have been called with the dummy hash
    expect(password.verifyPassword).toHaveBeenCalledOnce()
  })

  it("does not include passwordHash in the returned user object", async () => {
    vi.mocked(usersRepo.findByEmail).mockResolvedValue(MOCK_USER as any)
    vi.mocked(password.verifyPassword).mockResolvedValue(true)

    const result = await authService.login({
      email: "test@example.com", password: "correct"
    })

    expect(result.user).not.toHaveProperty("passwordHash")
  })
})
