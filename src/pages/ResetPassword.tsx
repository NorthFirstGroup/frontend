import { userResetPassword } from '@api/authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Container, Form, Stack } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import z from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;

const resetPasswordSchema = z
    .object({
        password: z
            .string({ required_error: '舊密碼為必填' })
            .min(8, { message: '密碼至少 8 個字' })
            .max(16, { message: '密碼最多 16 個字' })
            .regex(passwordRegex, { message: '密碼需包含大小寫字母與數字' }),
        newPassword: z
            .string({ required_error: '新密碼為必填' })
            .min(8, { message: '密碼至少 8 個字' })
            .max(16, { message: '密碼最多 16 個字' })
            .regex(passwordRegex, { message: '密碼需包含大小寫字母與數字' }),
        confirmPassword: z
            .string({ required_error: '新密碼為必填' })
            .min(8, { message: '密碼至少 8 個字' })
            .max(16, { message: '密碼最多 16 個字' })
            .regex(passwordRegex, { message: '密碼需包含大小寫字母與數字' })
    })
    .refine(data => data.newPassword === data.confirmPassword, {
        message: '新密碼與確認密碼不一致',
        path: ['confirmPassword']
    });
type FormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {}
    });

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        try {
            const { confirmPassword: _confirmPassword, ...payload } = data;
            await userResetPassword(payload);
            toast.success('密碼重設成功！');
            setTimeout(() => {
                navigate('/user/profile');
            }, 1500);
        } catch (error: any) {
            console.error('密碼重設失敗', error);
            toast.error('密碼重設失敗，請稍後再試！');
        }
    };
    return (
        <Container className="mt-5 py-4 d-flex justify-content-center flex-column" style={{ maxWidth: '400px' }}>
            <h3 className="text-start">重設密碼</h3>
            <form
                className="w-100"
                onSubmit={handleSubmit(onSubmit, errors => {
                    console.log('Form errors:', errors);
                })}
            >
                <Stack className="w-100" gap={2}>
                    <div>
                        <Form.Label column>舊密碼</Form.Label>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Form.Control
                                    {...field}
                                    value={field.value ?? ''}
                                    className={errors.password?.message && 'is-invalid'}
                                />
                            )}
                        />
                        {errors.password && <Form.Text className="text-danger">{errors.password.message}</Form.Text>}
                    </div>
                    <div>
                        <Form.Label column>新密碼</Form.Label>
                        <Controller
                            name="newPassword"
                            control={control}
                            render={({ field }) => (
                                <Form.Control
                                    {...field}
                                    value={field.value ?? ''}
                                    className={errors.newPassword?.message && 'is-invalid'}
                                />
                            )}
                        />
                        {errors.newPassword && (
                            <Form.Text className="text-danger">{errors.newPassword.message}</Form.Text>
                        )}
                    </div>
                    <div>
                        <Form.Label column>確認密碼</Form.Label>
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <Form.Control
                                    {...field}
                                    value={field.value ?? ''}
                                    className={errors.confirmPassword?.message && 'is-invalid'}
                                />
                            )}
                        />
                        {errors.confirmPassword && (
                            <Form.Text className="text-danger">{errors.confirmPassword.message}</Form.Text>
                        )}
                    </div>
                    <Button variant="primary" type="submit" className="w-100">
                        確認修改
                    </Button>
                </Stack>
            </form>
        </Container>
    );
};

export default ResetPassword;
