import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador personalizado para email
 */
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Si está vacío, el Validators.required se encargará
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { invalidEmail: { value: control.value } };
  };
}

/**
 * Validador personalizado para teléfono (solo números, espacios, guiones y paréntesis)
 */
export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Si está vacío y es opcional, no hay error
    }
    const phoneRegex = /^[0-9+\-\s()]+$/;
    const valid = phoneRegex.test(control.value) && control.value.length <= 20;
    return valid ? null : { invalidPhone: { value: control.value } };
  };
}

/**
 * Validador personalizado para números (solo dígitos)
 */
export function numberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Si está vacío, el Validators.required se encargará
    }
    const numberRegex = /^[0-9]+$/;
    const valid = numberRegex.test(control.value.toString());
    return valid ? null : { invalidNumber: { value: control.value } };
  };
}

/**
 * Validador personalizado para números decimales
 */
export function decimalValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const decimalRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
    const valid = decimalRegex.test(control.value.toString());
    return valid ? null : { invalidDecimal: { value: control.value } };
  };
}

/**
 * Validador personalizado para longitudes mínimas
 */
export function minLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const valid = control.value.toString().length >= minLength;
    return valid ? null : { minLength: { requiredLength: minLength, actualLength: control.value.length } };
  };
}

/**
 * Validador personalizado para longitudes máximas
 */
export function maxLengthValidator(maxLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const valid = control.value.toString().length <= maxLength;
    return valid ? null : { maxLength: { requiredLength: maxLength, actualLength: control.value.length } };
  };
}

/**
 * Validador personalizado para valores positivos
 */
export function positiveNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const value = parseFloat(control.value);
    const valid = !isNaN(value) && value > 0;
    return valid ? null : { invalidPositiveNumber: { value: control.value } };
  };
}

/**
 * Validador personalizado para valores no negativos (>= 0)
 */
export function nonNegativeNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const value = parseFloat(control.value);
    const valid = !isNaN(value) && value >= 0;
    return valid ? null : { invalidNonNegativeNumber: { value: control.value } };
  };
}

/**
 * Función helper para obtener mensajes de error
 */
export function getErrorMessage(control: AbstractControl | null, fieldName: string): string {
  if (!control || !control.errors || !control.touched) {
    return '';
  }

  const errors = control.errors;

  if (errors['required']) {
    return `${fieldName} es obligatorio`;
  }
  if (errors['invalidEmail']) {
    return 'Ingrese un email válido';
  }
  if (errors['invalidPhone']) {
    return 'Ingrese un teléfono válido (solo números, espacios, guiones y paréntesis)';
  }
  if (errors['invalidNumber']) {
    return 'Solo se permiten números';
  }
  if (errors['invalidDecimal']) {
    return 'Ingrese un número decimal válido (ej: 10.50)';
  }
  if (errors['minLength']) {
    return `${fieldName} debe tener al menos ${errors['minLength'].requiredLength} caracteres`;
  }
  if (errors['maxLength']) {
    return `${fieldName} no puede exceder ${errors['maxLength'].requiredLength} caracteres`;
  }
  if (errors['min']) {
    return `El valor mínimo es ${errors['min'].min}`;
  }
  if (errors['max']) {
    return `El valor máximo es ${errors['max'].max}`;
  }
  if (errors['invalidPositiveNumber']) {
    return 'El valor debe ser mayor a cero';
  }
  if (errors['invalidNonNegativeNumber']) {
    return 'El valor no puede ser negativo';
  }
  if (errors['email']) {
    return 'Ingrese un email válido';
  }
  if (errors['pattern']) {
    return 'Formato inválido';
  }

  return 'Campo inválido';
}

