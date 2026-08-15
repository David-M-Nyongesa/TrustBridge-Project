import { useState } from "react";

export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(0);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    if (errors[name]) {
      const next = { ...errors };
      delete next[name];
      setErrors(next);
    }
  }

  function setField(name, value) {
    setValues({ ...values, [name]: value });
  }

  function nextStep() {
    const stepErrors = validate ? validate(values, step) : {};
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      setStep((s) => s + 1);
    }
  }

  function prevStep() {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  }

  function reset() {
    setValues(initialValues);
    setErrors({});
    setStep(0);
  }

  return { values, errors, step, handleChange, setField, nextStep, prevStep, reset };
}