import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Reset all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});
