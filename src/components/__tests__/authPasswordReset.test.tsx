import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";
import ForgotPasswordPage from "@/app/(auth)/forgot-password/page";
import ResetPasswordPage from "@/app/(auth)/reset-password/page";

const pushMock = vi.fn();
const refreshMock = vi.fn();
let searchParamsMock = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => searchParamsMock,
}));

// Mock Supabase client
const resetPasswordForEmailMock = vi.fn();
const updateUserMock = vi.fn();
const getSessionMock = vi.fn();
const onAuthStateChangeMock = vi.fn();
const exchangeCodeForSessionMock = vi.fn();
const verifyOtpMock = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      resetPasswordForEmail: resetPasswordForEmailMock,
      updateUser: updateUserMock,
      getSession: getSessionMock,
      onAuthStateChange: onAuthStateChangeMock,
      exchangeCodeForSession: exchangeCodeForSessionMock,
      verifyOtp: verifyOtpMock,
    },
  }),
}));

vi.mock("@/lib/supabase/env", () => ({
  getSupabaseEnv: () => ({
    url: "https://mock.supabase.co",
    anonKey: "mock-key",
    isConfigured: true,
  }),
}));

const fetchMock = vi.fn();
global.fetch = fetchMock;

describe("Authentication & Password Reset Suite", () => {
  beforeEach(() => {
    pushMock.mockClear();
    refreshMock.mockClear();
    resetPasswordForEmailMock.mockReset();
    updateUserMock.mockReset();
    getSessionMock.mockReset();
    onAuthStateChangeMock.mockReset();
    exchangeCodeForSessionMock.mockReset();
    verifyOtpMock.mockReset();
    fetchMock.mockReset();

    searchParamsMock = new URLSearchParams();

    // Default email-existence API mock (registered user)
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ exists: true }),
    });

    // Default Supabase auth mocks
    getSessionMock.mockResolvedValue({
      data: { session: { user: { id: "test-user-id" } } },
    });
    onAuthStateChangeMock.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  describe("Login Page - Forgot Password Link", () => {
    it("renders 'Forgot password?' link on Sign In mode", () => {
      render(<LoginPage />);

      const forgotLink = screen.getByRole("link", {
        name: /forgot password\?/i,
      });
      expect(forgotLink).toBeTruthy();
      expect(forgotLink.getAttribute("href")).toBe("/forgot-password");
    });

    it("hides 'Forgot password?' link when switching to Sign Up mode", () => {
      render(<LoginPage />);

      const signUpTab = screen.getByRole("button", { name: /sign up/i });
      fireEvent.click(signUpTab);

      expect(
        screen.queryByRole("link", { name: /forgot password\?/i })
      ).toBeNull();
    });

    it("displays friendly message if link_expired error parameter is present", () => {
      searchParamsMock = new URLSearchParams("error=link_expired");
      render(<LoginPage />);

      expect(
        screen.getByText(/your password reset link is invalid or has expired/i)
      ).toBeTruthy();
    });
  });

  describe("Forgot Password Page", () => {
    it("renders email field and submit button", () => {
      render(<ForgotPasswordPage />);

      expect(screen.getByRole("heading", { name: /reset password/i })).toBeTruthy();
      expect(screen.getByPlaceholderText("host@example.com")).toBeTruthy();
      expect(
        screen.getByRole("button", { name: /send reset link/i })
      ).toBeTruthy();
      expect(screen.getByRole("link", { name: /back to sign in/i })).toBeTruthy();
    });

    it("submits email to supabase.auth.resetPasswordForEmail and shows confirmation", async () => {
      resetPasswordForEmailMock.mockResolvedValue({ data: {}, error: null });

      render(<ForgotPasswordPage />);

      const input = screen.getByPlaceholderText("host@example.com");
      fireEvent.change(input, { target: { value: "Amina@Example.com " } });

      const submitBtn = screen.getByRole("button", { name: /send reset link/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          "/api/auth/check-email",
          expect.objectContaining({
            method: "POST",
            body: JSON.stringify({ email: "amina@example.com" }),
          })
        );
      });

      await waitFor(() => {
        expect(resetPasswordForEmailMock).toHaveBeenCalledWith(
          "amina@example.com",
          expect.objectContaining({
            redirectTo: expect.stringContaining("/auth/callback?next=/reset-password"),
          })
        );
      });

      await waitFor(() => {
        expect(screen.getByText("Check Your Inbox")).toBeTruthy();
        expect(screen.getByText(/amina@example\.com/)).toBeTruthy();
      });
    });

    it("rejects unregistered or spam emails without sending a reset link", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ exists: false }),
      });

      render(<ForgotPasswordPage />);

      const input = screen.getByPlaceholderText("host@example.com");
      fireEvent.change(input, { target: { value: "spam@notregistered.com" } });

      const submitBtn = screen.getByRole("button", { name: /send reset link/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(
          screen.getByText(/no account found with this email address/i)
        ).toBeTruthy();
      });

      expect(resetPasswordForEmailMock).not.toHaveBeenCalled();
    });

    it("handles rate limit errors gracefully", async () => {
      resetPasswordForEmailMock.mockResolvedValue({
        data: null,
        error: new Error("For security purposes, you can only request this once every 60 seconds"),
      });

      render(<ForgotPasswordPage />);

      const input = screen.getByPlaceholderText("host@example.com");
      fireEvent.change(input, { target: { value: "amina@example.com" } });

      const submitBtn = screen.getByRole("button", { name: /send reset link/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(
          screen.getByText(
            /for security purposes, please wait a minute before requesting another reset email/i
          )
        ).toBeTruthy();
      });
    });
  });

  describe("Reset Password Page", () => {
    it("renders password and confirm password inputs when active session exists", async () => {
      render(<ResetPasswordPage />);

      await waitFor(() => {
        expect(screen.getByText("Set New Password")).toBeTruthy();
      });

      expect(screen.getByPlaceholderText("Minimum 6 characters")).toBeTruthy();
      expect(
        screen.getByPlaceholderText("Re-enter your new password")
      ).toBeTruthy();
      expect(
        screen.getByRole("button", { name: /update password/i })
      ).toBeTruthy();
    });

    it("warns when passwords do not match", async () => {
      render(<ResetPasswordPage />);

      await waitFor(() => {
        expect(screen.getByText("Set New Password")).toBeTruthy();
      });

      const p1 = screen.getByPlaceholderText("Minimum 6 characters");
      const p2 = screen.getByPlaceholderText("Re-enter your new password");

      fireEvent.change(p1, { target: { value: "secret123" } });
      fireEvent.change(p2, { target: { value: "secret456" } });

      expect(screen.getByText(/passwords do not match/i)).toBeTruthy();

      const submitBtn = screen.getByRole("button", { name: /update password/i });
      fireEvent.click(submitBtn);

      expect(updateUserMock).not.toHaveBeenCalled();
    });

    it("successfully updates password when valid and matching", async () => {
      updateUserMock.mockResolvedValue({ data: {}, error: null });

      render(<ResetPasswordPage />);

      await waitFor(() => {
        expect(screen.getByText("Set New Password")).toBeTruthy();
      });

      const p1 = screen.getByPlaceholderText("Minimum 6 characters");
      const p2 = screen.getByPlaceholderText("Re-enter your new password");

      fireEvent.change(p1, { target: { value: "supersecret123" } });
      fireEvent.change(p2, { target: { value: "supersecret123" } });

      expect(screen.getByText(/passwords match/i)).toBeTruthy();

      const submitBtn = screen.getByRole("button", { name: /update password/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(updateUserMock).toHaveBeenCalledWith({
          password: "supersecret123",
        });
      });

      await waitFor(() => {
        expect(screen.getByText(/password updated!/i)).toBeTruthy();
      });
    });

    it("displays error when no active recovery session is found", async () => {
      getSessionMock.mockResolvedValue({ data: { session: null } });

      render(<ResetPasswordPage />);

      await waitFor(() => {
        expect(screen.getByText(/reset link expired or invalid/i)).toBeTruthy();
        expect(
          screen.getByRole("link", { name: /request new reset link/i })
        ).toBeTruthy();
      });
    });

    it("exchanges code for session if code query parameter is present", async () => {
      searchParamsMock = new URLSearchParams("code=valid-pkce-code");
      exchangeCodeForSessionMock.mockResolvedValue({ data: {}, error: null });

      render(<ResetPasswordPage />);

      await waitFor(() => {
        expect(exchangeCodeForSessionMock).toHaveBeenCalledWith("valid-pkce-code");
      });
    });
  });
});
