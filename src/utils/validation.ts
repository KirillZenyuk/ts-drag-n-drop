export interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
}

export function validate(input: Validatable) {
  let isValid = true;
  if (input.required) {
    isValid = isValid && input.value.toString().trim().length !== 0;
  }
  if (input.minLength != null && typeof input.value === "string") {
    isValid = isValid && input.value.length >= input.minLength;
  }
  if (input.maxLength != null && typeof input.value === "string") {
    isValid = isValid && input.value.length <= input.maxLength;
  }
  if (input.minValue != null && typeof input.value === "number") {
    isValid = isValid && input.value >= input.minValue;
  }
  if (input.maxValue != null && typeof input.value === "number") {
    isValid = isValid && input.value <= input.maxValue;
  }
  return isValid;
}
