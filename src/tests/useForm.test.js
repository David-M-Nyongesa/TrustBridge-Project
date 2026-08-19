import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useForm } from "../hooks/useForm";

const validate = (values, step) =>
  step === 0 && !values.type ? { type: "Choose a type." } : {};

describe("useForm", () => {
  it("blocks nextStep while the current step is invalid", () => {
    const { result } = renderHook(() => useForm({ type: "" }, validate));

    act(() => result.current.nextStep());

    expect(result.current.step).toBe(0);                
    expect(result.current.errors.type).toBe("Choose a type.");
  });

  it("advances once the data is valid, and clears errors", () => {
    const { result } = renderHook(() => useForm({ type: "" }, validate));

    act(() => result.current.setField("type", "house"));
    act(() => result.current.nextStep());

    expect(result.current.step).toBe(1);                 
    expect(result.current.errors).toEqual({});           
  });

  it("reset returns to the initial state", () => {
    const { result } = renderHook(() => useForm({ type: "" }, validate));

    act(() => result.current.setField("type", "car"));
    act(() => result.current.nextStep());
    act(() => result.current.reset());

    expect(result.current.step).toBe(0);
    expect(result.current.values.type).toBe("");
  });
});