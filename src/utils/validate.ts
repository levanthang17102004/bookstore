export class Validate {
  static email(mail: string) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  }

  static Password = (val: string) => {
    return val.length >= 6;
  };

  static validateSignUp = (values: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const errors: any = {};

    // Validate username
    if (!values.username || values.username.trim() === '') {
      errors.username = 'Vui lòng nhập họ tên';
    } else if (values.username.trim().length < 2) {
      errors.username = 'Họ tên phải có ít nhất 2 ký tự';
    }

    // Validate email
    if (!values.email || values.email.trim() === '') {
      errors.email = 'Vui lòng nhập email';
    } else if (!this.email(values.email)) {
      errors.email = 'Email không hợp lệ';
    }

    // Validate password
    if (!values.password || values.password === '') {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (!this.Password(values.password)) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Validate confirm password
    if (!values.confirmPassword || values.confirmPassword === '') {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  };
}