import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
    password: Yup.string()
    .min(6, 'Password cần tối thiểu 6 ký tự !')
    .max(50, 'Password tối đa 50 ký tự !')
    .required('Password không được để trống !'),
    email: Yup.string().email('Định dạng Email không hợp lệ !').required('Email không được để trống !'),
});

export const SignUpSchema = Yup.object().shape({
    username: Yup.string()
        .trim()
        .min(2, 'Họ tên phải có ít nhất 2 ký tự')
        .required('Vui lòng nhập họ tên'),
    email: Yup.string()
        .trim()
        .email('Email không hợp lệ')
        .required('Vui lòng nhập email'),
    password: Yup.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .max(50, 'Mật khẩu tối đa 50 ký tự')
        .required('Vui lòng nhập mật khẩu'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp')
        .required('Vui lòng xác nhận mật khẩu'),
});
    
    